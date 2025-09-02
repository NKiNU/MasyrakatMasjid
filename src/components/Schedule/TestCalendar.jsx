import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    const checkUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      const connected = params.get('connected');
      
      if (errorParam) {
        setConnectionError(decodeURIComponent(errorParam));
        window.history.replaceState({}, '', window.location.pathname);
      } else if (connected === 'true') {
        setIsConnected(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    checkUrlParams();
    checkCalendarConnection();
  }, []);

  const checkCalendarConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:3001/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsConnected(response.data.calendarConnected);
      if (response.data.calendarConnected) {
        await fetchEvents();
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setError(error.response?.data?.message || 'Failed to check calendar connection');
    } finally {
      setLoading(false);
    }
  };

  const connectCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:3001/api/calendar/connect', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to connect to Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:3001/api/calendar/events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch events');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Connect Google Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          {connectionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          )}
          <Button 
            onClick={connectCalendar} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Connecting...' : 'Connect Calendar'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Your Calendar Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming events found</p>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="p-4">
                <h3 className="font-semibold text-lg">{event.summary}</h3>
                <p className="text-gray-600">
                  {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                </p>
                {event.description && (
                  <p className="mt-2 text-gray-700">{event.description}</p>
                )}
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;