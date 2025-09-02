const Notification = require('../model/notification');

let io;

class NotificationService {
    static init(socketIo) {
        io = socketIo;
        // Debug: Log when service is initialized
        console.log('NotificationService initialized with Socket.IO');
        
        // Debug: Log all connected sockets
        io.on('connection', (socket) => {
            console.log('Connected sockets:', io.sockets.sockets.size);
            console.log('Socket rooms:', [...socket.rooms]);
        });
    }
    static async createNotification(data) {
      try {
        const notification = new Notification(data);
        await notification.save();
        
        io.emit('newNotification', notification);
        return notification;
      } catch (error) {
        throw new Error(`Error creating notification: ${error.message}`);
      }
    }
  
    static async getNotifications(userId) {
      try {
        console.log("user id in service",userId)
        return await Notification.find({ userId }).sort({ createdAt: -1 });
      } catch (error) {
        throw new Error(`Error fetching notifications: ${error.message}`);
      }
    }
  
    static async markAsRead(notificationId) {
      try {
        return await Notification.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );
      } catch (error) {
        throw new Error(`Error marking notification as read: ${error.message}`);
      }
    }
  }

  module.exports = NotificationService;