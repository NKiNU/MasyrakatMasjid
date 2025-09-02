const NotificationService = require('../utils/notificationService');

const createPaymentNotification = async (order, user) => {
    let title, message;
    
    switch (order.paymentType) {
      case 'donation':
        title = 'Donation Successful';
        message = `Thank you for your donation of RM ${order.amount} to ${order.donationDetails.title}`;
        break;
      case 'service':
        title = 'Service Booking Confirmed';
        message = `Your booking for ${order.serviceDetails.name} on ${new Date(order.serviceDetails.date).toLocaleDateString()} is confirmed`;
        break;
      case 'purchase':
        title = 'Purchase Successful';
        message = `Your order #${order.orderId} for ${order.items.length} item(s) has been confirmed`;
        break;
      case 'class':
        title = 'Class Registration Confirmed';
        message = `You're registered for ${order.classDetails.title} starting on ${new Date(order.classDetails.startDate).toLocaleDateString()}`;
        break;
    }
  
    await NotificationService.createNotification({
      userId: user._id,
      title,
      message,
      type: order.paymentType,
      referenceId: order.orderId
    });
  };

const createFlagNotification = async (content, user, reason) => {
    let title, message;
    
    // Get content type and name based on the content structure
    const contentType = content.type;
    const contentName = getContentName(content);
    
    // Create notifications for both admin and content owner
    if (user.role === 'admin' || user.role === 'super admin') {
      // Notification for content owner
      title = 'Content Has Been Flagged';
      message = `Your ${contentType} "${contentName}" has been flagged for review. Reason: ${reason}`;
      
      await NotificationService.createNotification({
        userId: content.userId, // Content owner
        title,
        message,
        type: 'content-flag',
        referenceId: content._id,
        metadata: {
          contentType,
          action: 'flagged',
          reason,
          flaggedBy: user._id
        }
      });
      
      // Notification for other admins
      title = 'Content Flagged for Review';
      message = `${user.name} has flagged ${contentType} "${contentName}". Reason: ${reason}`;
      
      // Get all admin users except the one who flagged
      const adminUsers = await User.find({ 
        role: { $in: ['admin', 'super admin'] },
        _id: { $ne: user._id }
      });
      
      // Send notification to each admin
      for (const admin of adminUsers) {
        await NotificationService.createNotification({
          userId: admin._id,
          title,
          message,
          type: 'content-flag-review',
          referenceId: content._id,
          metadata: {
            contentType,
            action: 'flagged',
            reason,
            flaggedBy: user._id
          }
        });
      }
    }
  };

  const Class = require('../model/class');
const Event = require('../model/event');
// const NotificationService = require('../utils/notificationService');

// First, create the notification functions
const createClassEnrollmentNotification = async (classData, user, isLeaving = false) => {
  let title, message;
  console.log(user,"in noti")
  
  if (isLeaving) {
    title = 'Class Unenrollment';
    message = `You have successfully left the class "${classData.className}"`;
  } else {
    title = 'Class Enrollment Successful';
    message = `You have successfully enrolled in "${classData.className}" starting on ${new Date(classData.startDate).toLocaleDateString()}`;
    
    if (classData.venue === 'online') {
      message += `. This is an online class - you'll receive the class link via email.`;
    } else {
      message += `. Venue: ${classData.venueDetails}`;
    }
  }

  // Create notification for the user
  await NotificationService.createNotification({
    userId: user.id,
    title,
    message,
    type: 'class-enrollment',
    referenceId: classData._id,
    metadata: {
      action: isLeaving ? 'unenrolled' : 'enrolled',
      className: classData.className,
      startDate: classData.startDate,
      venue: classData.venue,
      venueDetails: classData.venueDetails
    }
  });

  // Notify class creator/admin about new enrollment
  // if (!isLeaving) {
  //   const adminTitle = 'New Class Enrollment';
  //   const adminMessage = `${user.username || user.email} has enrolled in "${classData.className}"`;
    
  //   await NotificationService.createNotification({
  //     userId: classData.createdBy,
  //     title: adminTitle,
  //     message: adminMessage,
  //     type: 'class-enrollment-admin',
  //     referenceId: classData._id,
  //     metadata: {
  //       action: 'new-enrollment',
  //       className: classData.className,
  //       enrolledUser: user._id,
  //       enrolledUserName: user.username || user.email
  //     }
  //   });
  // }
};

const createClassCapacityNotification = async (classData) => {
  const remainingSpots = classData.capacity - classData.participants.length;
  const capacityThreshold = Math.floor(classData.capacity * 0.1); // 10% threshold
  
  if (remainingSpots <= capacityThreshold) {
    const title = 'Class Nearly Full';
    const message = `Your class "${classData.className}" has only ${remainingSpots} spot${remainingSpots === 1 ? '' : 's'} remaining.`;
    
    await NotificationService.createNotification({
      userId: classData.createdBy,
      title,
      message,
      type: 'class-capacity',
      referenceId: classData._id,
      metadata: {
        action: 'capacity-warning',
        className: classData.className,
        remainingSpots,
        totalCapacity: classData.capacity
      }
    });
  }
};

  const createUnflagNotification = async (content, user) => {
    const contentType = content.type;
    const contentName = getContentName(content);
    
    // Notification for content owner
    const title = 'Content Flag Removed';
    const message = `The flag has been removed from your ${contentType} "${contentName}". It is now visible again.`;
    
    await NotificationService.createNotification({
      userId: content.userId,
      title,
      message,
      type: 'content-unflag',
      referenceId: content._id,
      metadata: {
        contentType,
        action: 'unflagged',
        unflaggedBy: user._id
      }
    });
  };
  
  // Helper function to get content name based on content type
  function getContentName(content) {
    switch (content.type) {
      case 'classes':
        return content.className || 'Untitled Class';
      case 'donations':
        return content.title;
      case 'islamic-videos':
        return content.title;
      case 'news':
        return content.title;
      case 'products':
        return content.name;
      case 'services':
        return content.name;
      default:
        return 'Untitled Content';
    }
  }

  module.exports = { createFlagNotification,
    createUnflagNotification,createPaymentNotification , createClassEnrollmentNotification,createClassCapacityNotification};
