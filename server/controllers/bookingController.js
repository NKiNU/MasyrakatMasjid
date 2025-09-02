// controllers/booking.controller.js
const { Booking } = require('../model/booking');
const { Availability } = require('../model/booking');
const { sendEmail } = require('../utils/emails');
const Event = require('../model/event');


exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot } = req.body;

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the time slot is available
    const availability = await Availability.findOne({
      serviceId,
      'dates.date': new Date(date),
      'dates.timeSlots.startTime': timeSlot.startTime,
      'dates.timeSlots.isBooked': false,
    });

    

    if (!availability) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Create booking
    const booking = new Booking({
      serviceId,
      userId: req.user.id,
      date,
      timeSlot,
      notes: req.body.notes,
    });

    await booking.save();

    // Update availability
    await Availability.updateOne(
      {
        serviceId,
        'dates.date': new Date(date),
        'dates.timeSlots.startTime': timeSlot.startTime,
      },
      {
        $set: {
          'dates.$[dateElem].timeSlots.$[slotElem].isBooked': true,
        },
      },
      {
        arrayFilters: [
          { 'dateElem.date': new Date(date) },
          { 'slotElem.startTime': timeSlot.startTime },
        ],
      }
    );

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




exports.updateBookingStatus = async (req, res) => {
  try {
    console.log("in update status");
    const { bookingId, status, adminNotes } = req.body;

    // Validate input
    if (!bookingId || !status) {
      return res.status(400).json({ message: 'bookingId and status are required' });
    }

    const validStatuses = ['approved', 'rejected', 'cancelled', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'email emailNotifications')
      .populate('serviceId', 'name duration');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = status;
    booking.adminNotes = adminNotes;
    await booking.save();

    // If booking is approved, create a calendar event
    if (status === 'approved') {
      try {
        const startDate = new Date(booking.date);
        if (isNaN(startDate)) {
          throw new Error('Invalid booking date');
        }

        const duration = booking.serviceId?.duration;
        if (!duration || isNaN(duration)) {
          throw new Error('Invalid service duration');
        }

        const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

        const eventData = {
          name: `Booking: ${booking.serviceId.name}`,
          eventType: 'booking',
          description: `Booking for ${booking.serviceId.name}\nNotes: ${booking.notes || 'None'}\nAdmin Notes: ${adminNotes || 'None'}`,
          startDate: startDate,
          endDate: endDate,
          source: 'local',
          createdBy: booking.userId._id,
        };

        console.log("Event Data to be save in calendar",eventData)

        const event = await Event.create(eventData);
        booking.calendarEventId = event._id;
        await booking.save();
      } catch (eventError) {
        console.error('Failed to create calendar event:', eventError);
      }
    }

    // Handle email notifications
    if (booking.userId?.emailNotifications) {
      try {
        const bookingDetails = {
          serviceName: booking.serviceId.name,
          bookingDate: booking.date,
          timeSlot: booking.timeSlot,
          adminNotes: adminNotes,
        };

        if (status === 'approved') {
          await sendEmail(booking.userId.email, 'bookingApproved', bookingDetails);
        } else if (status === 'rejected') {
          await sendEmail(booking.userId.email, 'bookingRejected', bookingDetails);
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    }

    // Handle rejected or cancelled bookings
    if (['rejected', 'cancelled'].includes(status)) {
      try {
        console.log("processing rejection")
        await Availability.findOneAndUpdate(
          {
            serviceId: booking.serviceId,
            'dates.date': booking.date,
            'dates.timeSlots.startTime': booking.timeSlot.startTime,
            'dates.timeSlots.isBooked': false,
          },
          {
            $set: { 
              'dates.$[dateElem].timeSlots.$[slotElem].isBooked': false 
            }
          },
          {
            arrayFilters: [
              { 'dateElem.date': booking.date },
              { 'slotElem.startTime': booking.timeSlot.startTime }
            ],
            new: true
          }
        );    

      } catch (slotError) {
        console.error('Failed to update availability or delete calendar event:', slotError);
      }
    }

    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({ userId: req.user.id })
      .populate('serviceId')
      .sort({ createdAt: -1 });
      console.log(bookings) 
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    console.log(req.user.role)
    const bookings = await Booking.find()
      .populate('serviceId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};