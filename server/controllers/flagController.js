const NotificationService = require('../utils/notificationService');
const User = require('../model/user');

const handleFlagNotifications = async (req, res) => {
  try {
    console.log(req.body)
    const { contentId, contentType, contentName, reason,user, userId } = req.body;

    // Notification for other admins
    title = 'Content Flagged for Review';
    message = `${user.username} has flagged ${contentType} "${contentName}". Reason: ${reason}`;
    
    // Get all admin users except the one who flagged
    const adminUsers = await User.find({ 
        role: 'admin',  // Assuming role is a string, not an array
        _id: { $ne: user._id }
      });
      

      console.log(adminUsers);
    
      // Send notification to each admin
      for (const admin of adminUsers) {
        try {
          await NotificationService.createNotification({
            userId: admin._id,
            title,
            message,
            type: 'flag',
            referenceId: contentId,
            createdBy:userId,
            metadata: {
              contentType,
              action: 'flagged',
              reason,
              flaggedBy: user._id
            }
          });
        } catch (notificationError) {
          console.error(`Error sending notification to admin ${admin._id}:`, notificationError);
        }
      }

          // Respond with success message
    res.status(200).json({ message: 'Notifications sent successfully' });
    
  } catch (error) {
    console.error('Error creating flag notifications:', error);
    res.status(500).json({ message: 'Failed to create notifications' });
  }
};

const handleUnflagNotifications = async (req, res) => {
    try {
      const { contentId, contentType, contentName, reason,user, userId } = req.body;
  
    //   if (!ownerId) {
    //     return res.status(400).json({ message: 'Content owner ID is required' });
    //   }
  
      
      const adminUsers = await User.find({ 
        role: 'admin',  // Assuming role is a string, not an array
        _id: { $ne: user._id }
      });

      for (const admin of adminUsers) {
        try {
            const notification = {
                userId: admin._id,
                title: 'Content Flag Removed',
                message: `The flag has been removed from your ${contentType} "${contentName}".`,
                type: 'unflag',
                referenceId: contentId,
                createdBy:userId,
                metadata: {
                  contentType,
                  action: 'unflagged',
                  unflaggedBy: userId
                }
              };
  
      await NotificationService.createNotification(notification);
    }catch (notificationError) {
        console.error(`Error sending notification to admin ${admin._id}:`, notificationError);
      }
    }


      res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error('Error creating unflag notification:', error);
      res.status(500).json({ message: 'Failed to create notification', error: error.message });
    }
  };

module.exports = {
  handleFlagNotifications,
  handleUnflagNotifications
};