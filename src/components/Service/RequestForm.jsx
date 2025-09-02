// components/ServiceBooking.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { toast } from 'react-hot-toast';
import serviceApi from '../../api/serviceApi';
import bookingApi from '../../api/bookingApi';
import {formatPaymentDetails} from '../Checkout/paymentUtils';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const ServiceBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchService = async () => {
    try {
      const data = await serviceApi.getServiceById(serviceId);
      setService(data);
    } catch (error) {
      toast.error('Failed to fetch service details');
      navigate('/services');
    }
  };

  const fetchAvailability = async () => {
    try {
      const data = await bookingApi.getAvailability(serviceId, selectedDate);
      setAvailableSlots(data.timeSlots.filter(slot => !slot.isBooked));
      console.log(data)
    } catch (error) {
      toast.error('Failed to fetch availability');
    }
  };

  const handleBooking = async () => {
    console.log("Service ID ", serviceId)
    console.log(selectedDate)
    console.log(selectedSlot)
    if (!selectedSlot || !selectedDate) {
      toast.error('Please select a date and time slot');
      return;
    }
  

    const bookingData = {
      name:service.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      notes,
      serviceId
    };
    console.log("booking Data ",bookingData)

    
    // const paymentData = formatPaymentDetails('booking', bookingData);
    const paymentData = formatPaymentDetails('booking', {
      service: service, // Include service details
      bookingDetails: bookingData,
    });
    navigate('/checkout', { state: paymentData });


  };
  

  if (!service) return null;

  return (
    <>
    <SidebarNavigation/>
    <MainLayout>
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Book {service.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">1. Select Date</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">2. Select Time Slot</h2>
          {selectedDate ? (
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot.startTime}
                  variant={selectedSlot?.startTime === slot.startTime ? "default" : "outline"}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.startTime} - {slot.endTime}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Please select a date first</p>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">3. Additional Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 p-2 border rounded-md"
            placeholder="Any special requests or notes for your booking..."
          />
        </div>

        <div className="md:col-span-2">
          <Button
            onClick={handleBooking}
            disabled={loading || !selectedSlot}
            className="w-full md:w-auto"
          >
            {loading ? 'Submitting...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>

    </MainLayout>
    </>

  );
};

export default ServiceBooking;
