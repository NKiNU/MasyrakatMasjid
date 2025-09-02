// services/googleCalendar.js
const { calendar } = require('../config/google-calendar');

class GoogleCalendarService {
  static async addEvent(userCalendarId, event) {
    try {
      const googleEvent = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.startDate,
          timeZone: 'UTC'
        },
        end: {
          dateTime: event.endDate,
          timeZone: 'UTC'
        }
      };

      const response = await calendar.events.insert({
        calendarId: userCalendarId,
        resource: googleEvent,
      });

      return response.data;
    } catch (error) {
      console.error('Error adding event to Google Calendar:', error);
      throw error;
    }
  }
}

module.exports = GoogleCalendarService;