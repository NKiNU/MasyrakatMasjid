// import React, { useState, useEffect } from 'react';
// import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';
// import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
// import { Button } from '../ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
// import { Input } from '../ui/input';
// import { Label } from '../ui/label';
// import { Alert, AlertDescription } from '../ui/alert';
// import { Toast } from '../ui/use-toast';

// const TimeSlot = ({ time }) => (
//   <div className="text-xs text-gray-500 pr-2 py-4 border-r border-gray-200 w-16 text-right">
//     {time}
//   </div>
// );

// const WeeklyCalendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState([]);
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [error, setError] = useState(null);
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     description: '',
//     startTime: '',
//     endTime: '',
//     date: null
//   });

//   // Generate week days and time slots
//   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
//   const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));
//   const timeSlots = [...Array(24)].map((_, i) => `${i.toString().padStart(2, '0')}:00`);

//   // Fetch all events
//   const fetchEvents = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
//       const weekEnd = addDays(weekStart, 7);

//       const response = await fetch(
//         `http://localhost:3001/api/events?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) throw new Error('Failed to fetch events');

//       const data = await response.json();
//       setEvents(data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       setError('Failed to fetch events');
//     }
//   };

//   // Add new event
//   const handleAddEvent = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const startDateTime = new Date(newEvent.date);
//       const [startHour] = newEvent.startTime.split(':');
//       startDateTime.setHours(parseInt(startHour), 0, 0);

//       const endDateTime = new Date(newEvent.date);
//       const [endHour] = newEvent.endTime.split(':');
//       endDateTime.setHours(parseInt(endHour), 59, 0);

//       const response = await fetch('http://localhost:3001/api/events', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: newEvent.title,
//           description: newEvent.description,
//           startDate: startDateTime,
//           endDate: endDateTime
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to add event');

//       await fetchEvents();
//       setShowEventModal(false);
//       setNewEvent({
//         title: '',
//         description: '',
//         startTime: '',
//         endTime: '',
//         date: null
//       });
      
//       Toast({
//         title: "Success",
//         description: "Event added successfully",
//       });
//     } catch (error) {
//       console.error('Error adding event:', error);
//       setError('Failed to add event');
//     }
//   };

//   // Navigation handlers
//   const handlePrevWeek = () => setCurrentDate(prevDate => addDays(prevDate, -7));
//   const handleNextWeek = () => setCurrentDate(prevDate => addDays(prevDate, 7));

//   // Time slot click handler
//   const handleTimeSlotClick = (date, time) => {
//     setSelectedTime({ date, time });
//     setNewEvent({
//       ...newEvent,
//       date,
//       startTime: time,
//       endTime: time.split(':')[0] + ':59'
//     });
//     setShowEventModal(true);
//   };

//   // Effect hook
//   useEffect(() => {
//     fetchEvents();
//   }, [currentDate]);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
      
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" size="icon" onClick={handlePrevWeek}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <h2 className="text-xl font-semibold">
//             {format(weekStart, 'MMMM yyyy')}
//           </h2>
//           <Button variant="outline" size="icon" onClick={handleNextWeek}>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>

//         <div className="flex gap-2">
//           <Button
//             onClick={() => {
//               setSelectedTime({ date: new Date(), time: '09:00' });
//               setShowEventModal(true);
//             }}
//             className="flex items-center gap-2"
//           >
//             <Plus className="h-4 w-4" />
//             Add Event
//           </Button>
//         </div>
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-8 border-b">
//         <div className="border-r" />
//         {weekDays.map((day, index) => (
//           <div
//             key={index}
//             className={`p-2 text-center border-r ${
//               isToday(day) ? 'bg-blue-50' : ''
//             }`}
//           >
//             <div className="font-medium">{format(day, 'EEE')}</div>
//             <div className={`text-lg ${isToday(day) ? 'text-blue-600' : ''}`}>
//               {format(day, 'd')}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Time Slots */}
//       <div className="grid grid-cols-8 h-[600px] overflow-y-auto">
//         <div className="col-span-1">
//           {timeSlots.map((time, index) => (
//             <TimeSlot key={index} time={time} />
//           ))}
//         </div>

//         {weekDays.map((day, dayIndex) => (
//           <div key={dayIndex} className="border-r">
//             {timeSlots.map((time, timeIndex) => {
//               const dayEvents = events.filter(event => {
//                 const eventStart = parseISO(event.startDate);
//                 const eventEnd = parseISO(event.endDate);
//                 const slotStart = new Date(day);
//                 slotStart.setHours(parseInt(time), 0, 0);
//                 const slotEnd = new Date(day);
//                 slotEnd.setHours(parseInt(time), 59, 59);
//                 return eventStart <= slotEnd && eventEnd >= slotStart;
//               });

//               return (
//                 <div
//                   key={timeIndex}
//                   className="border-b h-14 relative group cursor-pointer hover:bg-gray-50"
//                   onClick={() => handleTimeSlotClick(day, time)}
//                 >
//                   {dayEvents.map((event, eventIndex) => (
//                     <div
//                       key={eventIndex}
//                       className="absolute left-0 right-0 p-1 text-xs overflow-hidden bg-blue-100 border-l-4 border-blue-500"
//                       style={{
//                         top: '0',
//                         height: '100%',
//                         zIndex: 10
//                       }}
//                     >
//                       <div className="font-medium">{event.title}</div>
//                       <div className="text-gray-600 truncate">
//                         {event.description}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>

//       {/* Add Event Modal */}
//       <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add New Event</DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4 mt-4">
//             <div>
//               <Label htmlFor="title">Event Title</Label>
//               <Input
//                 id="title"
//                 value={newEvent.title}
//                 onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//               />
//             </div>
            
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Input
//                 id="description"
//                 value={newEvent.description}
//                 onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//               />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="startTime">Start Time</Label>
//                 <Input
//                   id="startTime"
//                   type="time"
//                   value={newEvent.startTime}
//                   onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="endTime">End Time</Label>
//                 <Input
//                   id="endTime"
//                   type="time"
//                   value={newEvent.endTime}
//                   onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowEventModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddEvent}>
//               Add Event
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default WeeklyCalendar;

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Video } from 'lucide-react';
import axios from 'axios';

const EventCard = ({ event }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(event.start)}</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}

            {event.meetLink && (
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Video className="h-4 w-4" />
                <a 
                  href={event.meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Join video call
                </a>
              </div>
            )}

            {event.attendees?.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{event.attendees.length} attendees</span>
              </div>
            )}

            {event.description && (
              <p className="mt-3 text-sm text-muted-foreground">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:3001/api/calendar/events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data.events);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.response?.data?.message || 'Failed to fetch calendar events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <CalendarIcon className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
            <p>No upcoming events found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
      </Card>
      
      <div className="space-y-4">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default CalendarEvents;