import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import bookingApi from '../../api/bookingApi';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const AvailabilityManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!id) {
        toast.error('No service selected');
        navigate('/service');
        return;
      }

      try {
        const response = await bookingApi.getServiceAvailability(id);
        if (response.data) {
          setIsEditing(true);
          const dates = response.data.dates.map(dateObj => new Date(dateObj.date));
          setSelectedDates(dates);
          if (response.data.dates[0]?.timeSlots) {
            setTimeSlots(response.data.dates[0].timeSlots);
          }
        }
      } catch (error) {
        console.log('No existing availability or error fetching:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAvailability();
  }, [id, navigate]);

  const addTimeSlot = () => {
    if (!newStartTime || !newEndTime) {
      toast.error('Please enter both start and end times');
      return;
    }

    setTimeSlots([...timeSlots, {
      startTime: newStartTime,
      endTime: newEndTime,
      isBooked: false
    }]);

    setNewStartTime('');
    setNewEndTime('');
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => 
      date.getTime() !== dateToRemove.getTime()
    ));
  };

  const handleSubmit = async () => {
    if (selectedDates.length === 0 || timeSlots.length === 0) {
      toast.error('Please select dates and add time slots');
      return;
    }

    setLoading(true);
    try {
      const availabilityData = {
        id,
        dates: selectedDates.map(date => ({
          date,
          timeSlots: timeSlots
        }))
      };

      if (isEditing) {
        await bookingApi.updateAvailability(availabilityData);
        toast.success('Availability updated successfully');
        navigate('/service');
      } else {
        await bookingApi.addAvailability(availabilityData);
        toast.success('Availability added successfully');
      }

      setTimeSlots([]);
      setSelectedDates([]);
    } catch (error) {
      toast.error(isEditing ? 'Failed to update availability' : 'Failed to add availability');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
    <SidebarNavigation/>
    <MainLayout>
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Service Availability' : 'Add Service Availability'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">1. Select Dates</h2>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
          
          {/* Selected Dates Display */}
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Selected Dates ({selectedDates.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedDates
                .sort((a, b) => a - b)
                .map((date, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{formatDate(date)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDate(date)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">2. Add Time Slots</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                placeholder="Start Time"
              />
              <Input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                placeholder="End Time"
              />
              <Button
                onClick={addTimeSlot}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeSlot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedDates.length === 0 || timeSlots.length === 0}
            className="w-full"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Availability' : 'Save Availability'}
          </Button>
        </div>
      </div>
    </div>
      </MainLayout></>

  );
};

export default AvailabilityManagement;