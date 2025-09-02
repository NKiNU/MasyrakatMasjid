const Payment = require('../model/payment');
const User = require('../model/user')
const Order = require('../model/order');
const Product = require('../model/product');
const { Booking, Availability } = require('../model/booking');
const Donation = require('../model/donations');
const {createPaymentNotification} = require('../middleware/notification')
const Cart = require('../model/cart');
const Class = require("../model/class");
const Event = require("../model/event");


exports.processPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    

    // Find the order by orderId
    const order = await Order.findOne({ orderId });
    console.log("order ",order);
    const user = await User.findOne(order.userId);
    
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if a payment already exists for this order
    let payment = await Payment.findOne({ orderId });

    if (!payment) {
      // Create a new payment record
      payment = await Payment.create({
        orderId,
        transactionId: `TXN${Date.now()}`,
        amount: order.amount,
        paymentMethod: 'card', // Default to card; adjust if needed
        status: 'completed', // Start with pending status
        paymentDetails: req.body,
      });
    }

    // Process payment based on payment type
    try {
      switch (order.paymentType) {
        case 'purchase':
          await processPurchaseOrder(order);
          await Cart.findOneAndDelete({ userId: order.userId });


          break;
        
        
        
          case 'service':
          const bookingResult = await processServiceBooking(order);
          if (bookingResult.success) {
            console.log('Service booking messages:', bookingResult.messages);
          }



          break;
        
          case 'donation':
          await processDonation(order);
          break;
        
          case 'class':  // Add this new case
          await processClassPayment(order);
          break;
          default:
          throw new Error('Invalid payment type');
      }
    }catch(error){
        console.log(error);
      }

      // Update payment and order status upon successful processing
      payment.status = 'completed';
      await payment.save();
      console.log(payment)

      order.status = 'paid';
      order.paymentInfo = {
        transactionId: payment.transactionId,
        paymentMethod: 'card',
        paidAt: new Date(),
      };
      await order.save();
      await createPaymentNotification(order,user)

      res.json({
        success: true,
        message: 'Payment processed successfully',
        payment,
        order,
      });
    } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message,
    });
  }
};


async function processPurchaseOrder(order) {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product: ${item.productId}`);
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (updatedProduct.stock < 0) {
      // Rollback the stock update
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
      throw new Error(`Stock became negative for product: ${item.productId}`);
    }
  }
  // await Cart.findOneAndDelete({ userId: order.userId });
}

async function processServiceBooking(order) {
  const messages = {
    success: [],
    errors: []
  };

  console.log("order being passed here to process the booking",order)

  try {
    // Validate service details
    if (!order.serviceDetails?.serviceId || 
        !order.serviceDetails?.date || 
        !order.serviceDetails?.timeSlot?.startTime || 
        !order.serviceDetails?.timeSlot?.endTime) {
      throw new Error('Invalid service details in order');
    }

    const bookingDate = new Date(order.serviceDetails.date);
    console.log("serviceId ",order.serviceDetails.serviceId)
    console.log("bookingDate ",bookingDate )
    console.log("Start Time Slot ",order.serviceDetails.timeSlot.startTime)
    console.log("is booked ",)

        // Debugging: Log all availabilities for the serviceId
        const allAvailabilities = await Availability.find({ serviceId: order.serviceDetails.serviceId });
        console.log("All availabilities for serviceId:", allAvailabilities);
    
    // Check slot availability
    // const availability = await Availability.findOne({
    //   serviceId: order.serviceDetails.serviceId,
    //   dates: {
    //     $elemMatch: {
    //       date: new Date(order.serviceDetails.date), // Ensure the date is a Date object
    //       timeSlots: {
    //         $elemMatch: {
    //           startTime: order.serviceDetails.timeSlot.startTime,
    //           isBooked: false
    //         }
    //       }
    //     }
    //   }
    // });

    const availability = await Availability.findOne({
      serviceId: order.serviceDetails.serviceId,
      $expr: {
        $in: [
          { $dateToString: { format: '%Y-%m-%d', date: new Date(order.serviceDetails.date) } }, // Normalize input date
          {
            $map: {
              input: '$dates.date', // Iterate over the `dates.date` array
              as: 'date',
              in: {
                $dateToString: { format: '%Y-%m-%d', date: '$$date' } // Normalize database date
              }
            }
          }
        ]
      },
      'dates.timeSlots.startTime': order.serviceDetails.timeSlot.startTime,
      'dates.timeSlots.isBooked': false
    });

    

    console.log("availability tanpa update",availability)

    if (!availability) {
      throw new Error('Time slot unavailable or already booked');
    }
    messages.success.push('Time slot is available');

    // Update availability
    const updatedAvailability = await Availability.findOneAndUpdate(
      {
        serviceId: order.serviceDetails.serviceId,
        'dates.date': bookingDate,
        'dates.timeSlots.startTime': order.serviceDetails.timeSlot.startTime,
        'dates.timeSlots.isBooked': false,
      },
      {
        $set: { 
          'dates.$[dateElem].timeSlots.$[slotElem].isBooked': true 
        }
      },
      {
        arrayFilters: [
          { 'dateElem.date': bookingDate },
          { 'slotElem.startTime': order.serviceDetails.timeSlot.startTime }
        ],
        new: true
      }
    );

    if (!updatedAvailability) {
      throw new Error('Failed to book time slot');
    }
    messages.success.push('Successfully marked time slot as booked');

    // Create booking record
    const booking = await Booking.create({
      serviceId: order.serviceDetails.serviceId,
      userId: order.userId,
      date: bookingDate,
      timeSlot: order.serviceDetails.timeSlot,
      status: 'pending',
    });

    if (booking) {
      messages.success.push('Booking record created successfully');
      messages.success.push(`Booking ID: ${booking._id}`);
      messages.success.push(`Booking status: ${booking.status}`);
    }

    // Return success response with all messages
    return {
      success: true,
      messages: messages.success,
      booking: booking
    };

  } catch (error) {
    messages.errors.push(error.message);
    
    // If we caught an error after updating availability but before creating booking,
    // try to rollback the availability update
    if (messages.success.includes('Successfully marked time slot as booked')) {
      try {
        await Availability.findOneAndUpdate(
          {
            serviceId: order.serviceDetails.serviceId,
            'dates.date': bookingDate,
            'dates.timeSlots.startTime': order.serviceDetails.timeSlot.startTime,
          },
          {
            $set: { 
              'dates.$[dateElem].timeSlots.$[slotElem].isBooked': false 
            }
          },
          {
            arrayFilters: [
              { 'dateElem.date': bookingDate },
              { 'slotElem.startTime': order.serviceDetails.timeSlot.startTime }
            ]
          }
        );
        messages.errors.push('Availability status rolled back due to booking failure');
      } catch (rollbackError) {
        messages.errors.push('Failed to rollback availability status: ' + rollbackError.message);
      }
    }

    throw {
      success: false,
      messages: messages.errors,
      error: error.message
    };
  }
}

async function processDonation(order) {
  if (!order.donationDetails?.donationId || !order.amount) {
    throw new Error('Invalid donation details');
  }

  const donation = await Donation.findById(order.donationDetails.donationId);
  if (!donation) {
    throw new Error('Donation not found');
  }

  if (donation.currentAmount + order.amount > donation.targetAmount) {
    throw new Error('Donation exceeds target amount');
  }

  // Update donation amount
  donation.currentAmount += order.amount;
  donation.donations.push({
    userId: order.userId,
    amount: order.amount,
    date: new Date()
  });

  await donation.save();
}

// Add this new helper function alongside other process functions
async function processClassPayment(order) {
  // Validate class details
  if (!order.classDetails?.classId) {
    throw new Error('Invalid class details');
  }

  // Find the class
  const classDoc = await Class.findById(order.classDetails.classId);
  if (!classDoc) {
    throw new Error('Class not found');
  }

  // Check if class is full
  if (classDoc.participants.length >= classDoc.capacity) {
    throw new Error('Class is already full');
  }

  // Check if user is already enrolled
  if (classDoc.participants.includes(order.userId)) {
    throw new Error('Already enrolled in this class');
  }

  // Add user to class participants
  classDoc.participants.push(order.userId);
  await classDoc.save();
  const endDateTime = new Date(classDoc.startDate);
      endDateTime.setHours(endDateTime.getHours() + 2); // Default 2-hour duration

      console.log("this is class information",{
        name: classDoc.className,
        description: classDoc.description,
        eventType: 'class',
        startDate: classDoc.startDate,
        endDate: endDateTime,
        createdBy: order.userId,
        source: 'class',
        sourceId: order.classDetails.classId
      })
      const event = await Event.create({
        name: classDoc.className,
        description: classDoc.description,
        eventType: 'class',
        startDate: classDoc.startDate,
        endDate: endDateTime,
        createdBy: order.userId,
        // sourceId: classId
      });
      console.log("has event correct?",event)

            const updatedClass = await Class.findById(order.classDetails.classId)
              .populate('participants', 'name email');

     
}
