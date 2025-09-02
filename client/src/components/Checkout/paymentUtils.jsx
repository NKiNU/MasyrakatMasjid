  // utils/paymentUtils.js
  export const formatPaymentDetails = (type, data) => {
      switch (type) {
        case 'donation':
          return {
            paymentType: 'donation',
            paymentDetails: {
              amount: parseFloat(data.amount),
              title: data.donationInfo.title,
              description: data.donationInfo.description,
              donationId: data.donationInfo._id
            }
          };
    
          case 'booking':
            return {
              paymentType: 'service',
              paymentDetails: {
                serviceName: data.service.name,
                description: `Booking for ${data.service.name} on ${data.bookingDetails.date}`,
                fee: data.service.price,
                bookingDetails: {
                  date: data.bookingDetails.date,
                  timeSlot: data.bookingDetails.timeSlot,
                  notes: data.bookingDetails.notes,
                  serviceId: data.bookingDetails.serviceId
                }
              }
            };
    
        case 'purchase':
          return {
            paymentType: 'purchase',
            paymentDetails: {
              products: data.cart.map(item => ({
                productId: item.productId._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.productId.img?.[0]
              })),
              deliveryAddress: data.deliveryAddress
            }
          };
          case 'class':
            return {
              paymentType: 'class',
              paymentDetails: {
                amount: parseFloat(data.classInfo.price),
                title: data.classInfo.className,
                description: `Enrollment for ${data.classInfo.className}`,
                classId: data.classInfo._id,
                startDate: data.classInfo.startDate,
                startTime: data.classInfo.startTime,
                venue: data.classInfo.venue
              }
            };
    
        default:
          throw new Error('Invalid payment type');
      }
    };