import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { initClient, listCalendarEvents, handleAuthClick, handleSignoutClick } from './googleCalendars';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    initClient();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await listCalendarEvents();
      const events = response.result.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
      }));
      setEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Sign In</button>
      <button onClick={handleSignoutClick}>Sign Out</button>
      <button onClick={loadEvents}>Load Events</button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default GoogleCalendar;
