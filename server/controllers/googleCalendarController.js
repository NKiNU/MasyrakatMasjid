const { google } = require('googleapis');
const User = require('../model/user');
const Event = require('../model/event');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.initializeGoogleCalendar = async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',  // Updated to full calendar access
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'consent'
    });

    res.json({ url });
  } catch (error) {
    console.error('Calendar initialization error:', error);
    res.status(500).json({ 
      message: 'Failed to initialize Google Calendar',
      error: error.message 
    });
  }
};

// Handle Google OAuth callback
exports.handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${process.env.FRONTEND_URL}/calendar?error=no_authorization_code`);
    }

    // Get tokens from Google
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info to match with our database
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: userInfo.data.email },
      {
        $set: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token,
          googleTokenExpiry: new Date(tokens.expiry_date),
          calendarConnected: true
        }
      },
      { new: true }
    );

    if (!user) {
      console.error('User not found:', userInfo.data.email);
      return res.redirect(`${process.env.FRONTEND_URL}/calendar?error=user_not_found`);
    }

    // res.redirect(`${process.env.FRONTEND_URL}/calendar?connected=true`);
    res.redirect(`${process.env.FRONTEND_URL}/tra?connected=true`);

  } catch (error) {
    console.error('Google callback error:', error);
    const errorMessage = encodeURIComponent(error.message);
    res.redirect(`${process.env.FRONTEND_URL}/calendar?error=${errorMessage}`);
  }
};

// Utility function to format event date
const formatEventDate = (dateTime, date) => {
    if (dateTime) {
      return new Date(dateTime).toISOString();
    }
    return new Date(date).toISOString();
  };
exports.getEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.calendarConnected) {
      return res.status(400).json({ 
        message: 'Calendar not connected' 
      });
    }

    // Set up OAuth client with user's credentials
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setMonth(timeMax.getMonth() + 3); // Get events for next 3 months

    // Modified parameters: Added singleEvents=true
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,  // This is required for orderBy=startTime
      orderBy: 'startTime',
      maxResults: 100
    });

    // Format events for frontend
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      description: event.description || '',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location || '',
      isAllDay: !event.start.dateTime,
      attendees: event.attendees || [],
      meetLink: event.hangoutLink || null,
      status: event.status
    }));

    res.json({
      events,
      nextPageToken: response.data.nextPageToken || null
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    
    if (error.code === 401) {
      return res.status(401).json({ 
        message: 'Calendar authentication expired. Please reconnect.' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to fetch calendar events',
      error: error.message 
    });
  }
};


exports.createEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("Request body:", req.body);
   
    if (!user || !user.calendarConnected) {
      return res.status(400).json({ message: 'Calendar not connected' });
    }

    // Map the incoming fields to match your schema
    const eventData = {
      name: req.body.name,
      eventType: req.body.type, // Changed from 'type' to 'eventType'
      description: req.body.description,
      startDate: req.body.start, // Changed from 'start' to 'startDate'
      endDate: req.body.end,     // Changed from 'end' to 'endDate'
      createdBy: req.user.id,
      source: req.body.syncWithGoogle ? 'google' : 'local'
    };

    // Create local event with mapped data
    const locEvent = await Event.create(eventData);

    // If sync is requested and Google Calendar is connected
    if (req.body.syncWithGoogle && user?.calendarConnected) {
      oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
     
      const googleEvent = {
        summary: req.body.name,
        description: req.body.description,
        start: {
          dateTime: new Date(req.body.start).toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(req.body.end).toISOString(),
          timeZone: 'UTC'
        }
      };

      console.log("Google Event payload:", googleEvent);

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: googleEvent
      });

      console.log("Google Calendar response:", response.data);

      await Event.findByIdAndUpdate(locEvent._id, {
        googleEventId: response.data.id,
        lastSyncedAt: new Date()
      });

      return res.status(201).json({
        ...locEvent.toObject(),
        googleEventId: response.data.id
      });
    }

    res.status(201).json(locEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      message: 'Failed to create event',
      error: error.message 
    });
  }
};

// Token refresh utility
async function refreshUserToken(user) {
  try {
    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });

    const { tokens } = await oauth2Client.refreshAccessToken();
    
    await User.findByIdAndUpdate(user._id, {
      googleAccessToken: tokens.access_token,
      googleTokenExpiry: new Date(tokens.expiry_date)
    });

    return tokens.access_token;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
}


// Update event in both local and Google Calendar
exports.updateEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const event = await Event.findOne({ _id: req.params.id, createdBy: req.user.id });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!user.calendarConnected) {
      return res.status(400).json({ message: 'Calendar not connected' });
    }

    // Set up OAuth2 client
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Update Google Calendar event
    if (event.googleEventId) {
      const googleEvent = {
        summary: req.body.name,
        description: req.body.description,
        start: {
          dateTime: new Date(req.body.startDate).toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(req.body.endDate).toISOString(),
          timeZone: 'UTC'
        }
      };

      await calendar.events.update({
        calendarId: 'primary',
        eventId: event.googleEventId,
        resource: googleEvent,
      });
    }

    // Update local event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      data: {
        event: updatedEvent
      }
    });

  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event from both local and Google Calendar
// exports.deleteEvent = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     const event = await Event.findOne({ _id: req.params.id, createdBy: req.user.id });

//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     if (!user.calendarConnected) {
//       return res.status(400).json({ message: 'Calendar not connected' });
//     }

//     // Set up OAuth2 client
//     oauth2Client.setCredentials({
//       access_token: user.googleAccessToken,
//       refresh_token: user.googleRefreshToken
//     });

//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

//     // Delete from Google Calendar
//     if (event.googleEventId) {
//       await calendar.events.delete({
//         calendarId: 'primary',
//         eventId: event.googleEventId
//       });
//     }

//     // Delete from local database
//     await Event.findByIdAndDelete(req.params.id);

//     res.status(204).json({
//       status: 'success',
//       data: null
//     });

//   } catch (error) {
//     console.error('Error deleting event:', error);
//     res.status(500).json({
//       message: 'Failed to delete event',
//       error: error.message
//     });
//   }
// };
// Delete event from both local and Google Calendar
exports.deleteEvent = async (req, res) => {
  try {
    console.log(req.params.id)
    // Find the user to ensure they exist and have the necessary tokens
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the event exists and belongs to the user
    const event = await Event.findOne({ googleEventId: req.params.id, createdBy: req.user.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate if the user has connected their calendar
    if (!user.calendarConnected) {
      return res.status(400).json({ message: 'Calendar not connected. Please connect your calendar to proceed.' });
    }

    // Set up OAuth2 client for Google Calendar
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Attempt to delete the event from Google Calendar if it exists
    if (event.googleEventId) {
      try {
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: event.googleEventId,
        });
      } catch (googleError) {
        console.error('Error deleting event from Google Calendar:', googleError);
        return res.status(500).json({
          message: 'Failed to delete event from Google Calendar. Please check your connection or try again later.',
          error: googleError.message,
        });
      }
    }

    // Delete the event from the local database
    await Event.findByIdAndDelete(event._id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      message: 'Failed to delete event. Please try again later.',
      error: error.message,
    });
  }
};


// New status endpoint
exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isConnected = user?.calendarConnected && user?.googleRefreshToken;
    
    res.json({
      connected: isConnected,
      lastSynced: user?.lastCalendarSync || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check calendar status' });
  }
};