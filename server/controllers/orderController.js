// controllers/orderController.js
const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');
const Service = require('../model/service');
const Donation = require('../model/donations');
const Class = require('../model/class')
const { Booking, Availability } = require('../model/booking'); // Add these models

exports.createOrder = async (req, res) => {
  try {
    const { paymentType, paymentDetails, userId,deliveryFee,
      serviceFee,total } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user)

    // Service booking validation
    if (paymentType === 'service') {
      const { serviceId,name, date, timeSlot } = paymentDetails.bookingDetails;
      console.log("Service name in the create service order",name)
    
      // Check if service exists
      const service = await Service.findById(serviceId);
      console.log(service);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    
      // Normalize the input date to 'YYYY-MM-DD'
      const inputDate = new Date(date); // Convert the input date string to a Date object
      const normalizedDate = inputDate.toISOString().split('T')[0]; // Extract the date part as 'YYYY-MM-DD'
    
      // Check availability
      const availability = await Availability.findOne({
        serviceId,
        $expr: {
          $in: [
            normalizedDate, // The normalized input date in 'YYYY-MM-DD' format
            {
              $map: {
                input: '$dates.date', // Iterate over the `dates.date` array
                as: 'date',
                in: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: { $toDate: '$$date' } // Convert the string to a Date object
                  }
                }
              }
            }
          ]
        },
        'dates.timeSlots.startTime': timeSlot.startTime,
        'dates.timeSlots.isBooked': false
      });
    
      if (!availability) {
        return res.status(400).json({ message: 'Time slot not available' });
      }
    }

    // Product purchase validation
    if (paymentType === 'purchase') {
      // Validate product stock
      for (const item of paymentDetails.products) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for product: ${product ? product.name : 'Product not found'}` 
          });
        }
      }
    }

    // Donation validation
    if (paymentType === 'donation') {
      const donation = await Donation.findById(paymentDetails.donationId);
      if (!donation) {
        return res.status(404).json({ message: 'Donation campaign not found' });
      }
    }
        if (paymentType === 'class') {
      const classItem = await Class.findById(paymentDetails.classId);
      if (!classItem) {
        return res.status(404).json({ message: 'Class not found' });
      }
    }

    // Rest of your existing code...
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

    console.log("This is the details: ",paymentDetails);
    
    const orderData = {
      orderId,
      userId,
      paymentType,
      serviceFee,
      deliveryFee,
      status: 'pending',
      amount: total,
      // Add required fields based on schemas
      ...(paymentType === 'service' && {
        serviceDetails: {
          ...paymentDetails.bookingDetails,name:paymentDetails.serviceName,
          status: 'pending' // Match Booking schema status enum
        }
      }),
      ...(paymentType === 'purchase' && {
        items: paymentDetails.products.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
          // Change this part from string to object
  deliveryAddress: {
    street: paymentDetails.deliveryAddress.street,
    city: paymentDetails.deliveryAddress.city,
    state: paymentDetails.deliveryAddress.state,
    postalCode: paymentDetails.deliveryAddress.postalCode
  }}),
      ...(paymentType === 'donation' && {
        donationDetails: {
          donationId: paymentDetails.donationId,
          title: paymentDetails.title,
          description: paymentDetails.description
        }
      }),
      ...(paymentType === 'class' && {
        classDetails: {
          classId: paymentDetails.classId,
          title: paymentDetails.title,
          description: paymentDetails.description,
          startDate: new Date(paymentDetails.startDate),
          startTime: paymentDetails.startTime,
          venue: paymentDetails.venue
        }
      })
    };

    console.log("this is order data: ",orderData)

    const order = await Order.create(orderData);

    // Create booking if service type
    // if (paymentType === 'service') {
    //   await Booking.create({
    //     serviceId: paymentDetails.bookingDetails.serviceId,
    //     userId,
    //     date: paymentDetails.bookingDetails.date,
    //     timeSlot: paymentDetails.bookingDetails.timeSlot,
    //     status: 'pending',
    //     adminNotes:paymentDetails.bookingDetails.nots,
        
    //   });
    //   await Availability.updateOne(
    //     {
    //       serviceId,
    //       'dates.date': new Date(date),
    //       'dates.timeSlots.startTime': timeSlot.startTime,
    //     },
    //     {
    //       $set: {
    //         'dates.$[dateElem].timeSlots.$[slotElem].isBooked': true,
    //       },
    //     },
    //     {
    //       arrayFilters: [
    //         { 'dateElem.date': new Date(date) },
    //         { 'slotElem.startTime': timeSlot.startTime },
    //       ],
    //     }
    //   );
    // }

    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

function calculateServiceFee(paymentType, details) {
    const baseRate = 0.02; // 2% service fee
    let amount = 0;
  
    switch (paymentType) {
      case 'purchase':
        amount = details.products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        break;
      case 'service':
        amount = details.fee;
        break;
      case 'donation':
        amount = details.amount;
        break;
    }
  
    return Number((amount * baseRate).toFixed(2));
  }
  
  function calculateTotal(products, serviceFee, deliveryFee) {
    const subtotal = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return Number((subtotal + serviceFee + deliveryFee).toFixed(2));
  }


// Add these new functions
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('userId', 'username email')
      .populate('items.productId', 'name price')
      .populate('serviceDetails.serviceId', 'name price')
      .populate('classDetails.classId', 'name price startDate startTime venue');
    
    if (!order) {

      order = await Order.findOne({ _id: req.params.orderId })
      .populate('userId', 'username email')
      .populate('items.productId', 'name price')
      .populate('serviceDetails.serviceId', 'name price')
      .populate('classDetails.classId', 'name price startDate startTime venue');
      
      if (!order){
        return res.status(404).json({ message: 'Order not found' });
    }
  }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order details' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status)
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    console.log(order)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};