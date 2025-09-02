import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';
import moment from 'moment';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import MainLayout from '../components/MainLayout';

const EventCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    eventType: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    syncWithGoogle: false
  });

  useEffect(() => {
    checkGoogleConnection();
    fetchEvents();
  }, [currentMonth, isGoogleConnected]);

  const checkGoogleConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/calendar/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsGoogleConnected(response.data.connected);
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const localResponse = await axios.get('http://localhost:3001/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      let allEvents = localResponse.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        source: 'local'
      }));

      if (isGoogleConnected) {
        const googleResponse = await axios.get('http://localhost:3001/api/calendar/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const googleEvents = googleResponse.data.events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          source: 'google'
        }));
        allEvents = [...allEvents, ...googleEvents];
      }
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setFormData({
      name: '',
      eventType: '',
      description: '',
      startDate: date,
      endDate: date,
      syncWithGoogle: false
    });
    setShowModal(true);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        {!isGoogleConnected ? (
          <button
            onClick={async () => {
              const token = localStorage.getItem('token');
              const response = await axios.get('http://localhost:3001/api/calendar/connect', {
                headers: { Authorization: `Bearer ${token}` }
              });
              window.location.href = response.data.url;
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <CalendarIcon className="w-4 h-4" />
            Connect Google Calendar
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <CalendarIcon className="w-4 h-4" />
            Google Calendar Connected
          </div>
        )}
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const start = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="font-semibold text-center py-2">
          {format(addDays(start, i), 'EEEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEvents = events.filter(event => 
          isSameDay(new Date(event.start), currentDay)
        );

        days.push(
          <div
            key={day}
            className={`min-h-[120px] p-2 border relative ${
              !isSameMonth(day, monthStart) ? 'bg-gray-50' : ''
            } ${isSameDay(day, selectedDate) ? 'bg-blue-50' : ''}`}
          >
            <div className="flex justify-between">
              <span className={`${isSameMonth(day, monthStart) ? '' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </span>
              <button
                onClick={() => handleAddEvent(day)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {dayEvents.map((event, index) => (
                <div
                  key={event._id || event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setFormData({
                      name: event.title || event.name,
                      eventType: event.eventType,
                      description: event.description,
                      startDate: new Date(event.start),
                      endDate: new Date(event.end),
                      syncWithGoogle: event.source === 'google'
                    });
                    setShowModal(true);
                  }}
                  className={`p-1 rounded text-sm truncate cursor-pointer ${
                    event.source === 'google' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}
                >
                  {event.title || event.name}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="flex-1">{rows}</div>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (selectedEvent) {
        if (selectedEvent.source === 'google') {
          await axios.put(
            `http://localhost:3001/api/calendar/events/${selectedEvent.id}`,
            formData,
            config
          );
        } else {
          await axios.put(
            `http://localhost:3001/api/events/${selectedEvent._id}`,
            formData,
            config
          );
        }
      } else {
        if (isGoogleConnected && formData.syncWithGoogle) {
          await axios.post('http://localhost:3001/api/calendar/events', {
            name: formData.name,
            type: formData.eventType,
            description: formData.description,
            start: formData.startDate,
            end: formData.endDate,
            syncWithGoogle: true
          }, config);
        } else {
          await axios.post('http://localhost:3001/api/events', formData, config);
        }
      }
      
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      console.log(selectedEvent.id)

      if (selectedEvent.source === 'google') {
        await axios.delete(`http://localhost:3001/api/calendar/events/${selectedEvent._id}`, config);
      } else {
        await axios.delete(`http://localhost:3001/api/events/${selectedEvent.id}`, config);
      }

      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (

    <>
    <SidebarNavigation/>
    <MainLayout>

    <div className="h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {renderHeader()}
        {renderDays()}
        {renderCells()}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedEvent ? 'Edit Event' : 'Create Event'}
                  </h2>
                  <button onClick={() => setShowModal(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Event Type</label>
                    <input
                      type="text"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        value={moment(formData.startDate).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        value={moment(formData.endDate).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                  </div>

                  {isGoogleConnected && !selectedEvent && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="syncWithGoogle"
                        checked={formData.syncWithGoogle}
                        onChange={(e) => setFormData({ ...formData, syncWithGoogle: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="syncWithGoogle" className="text-sm">
                        Sync with Google Calendar
                      </label>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    {selectedEvent && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {selectedEvent ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    </MainLayout>
    </>

  );
};

export default EventCalendar;