// utils/googleCalendar.js
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

// Configure OAuth2 client
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Function to fetch events from Google Calendar
const fetchGoogleCalendarEvents = async (auth, timeMin, timeMax) => {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items.map(event => ({
      title: event.summary,
      description: event.description || '',
      startDate: event.start.dateTime || event.start.date,
      endDate: event.end.dateTime || event.end.date,
      googleCalendarEventId: event.id,
      isGoogleEvent: true
    }));
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    throw error;
  }
};

// Function to add event to Google Calendar
const addEventToGoogleCalendar = async (auth, eventData) => {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: new Date(eventData.startDate).toISOString(),
        timeZone: 'UTC'
      },
      end: {
        dateTime: new Date(eventData.endDate).toISOString(),
        timeZone: 'UTC'
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
};

module.exports = {
  oauth2Client,
  fetchGoogleCalendarEvents,
  addEventToGoogleCalendar
};