import { gapi } from 'gapi-script';

const CLIENT_ID = '';
const API_KEY = '';
const SCOPES = '';

export const initClient = () => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: SCOPES,
    });
  });
};

export const handleAuthClick = () => {
  gapi.auth2.getAuthInstance().signIn();
};

export const handleSignoutClick = () => {
  gapi.auth2.getAuthInstance().signOut();
};

export const listCalendarEvents = () => {
  return gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 2500,
    orderBy: 'startTime',
  });
};
