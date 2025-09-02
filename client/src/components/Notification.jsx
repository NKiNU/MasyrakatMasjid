import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NotificationPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(currentUser?._id + currentUser?.username);
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        // Fetch orders for each notification
        const notificationsWithOrders = await Promise.all(
          response.data.map(async (notification) => {
            if (notification.type === 'payment' || notification.type === 'booking'  || notification.type === 'donation') {
              const orderResponse = await axios.get(`http://localhost:3001/api/checkout/orders/${notification.referenceId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              return { ...notification, orderData: orderResponse.data };
            }
            return notification;
          })
        );
    
        setNotifications(notificationsWithOrders);
        setUnreadCount(notificationsWithOrders.filter(notif => !notif.isRead).length);
        console.log(notifications)
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const setupSocket = () => {
      const token = localStorage.getItem('token');
      const newSocket = io('http://localhost:3001', {
        auth: { token },
      });

      newSocket.on('connect', () => {
        console.log('Connected to notification socket');
      });

      newSocket.on('newNotification', (notification) => {
        console.log('Received new notification:', notification);
        if (notification.userId === currentUser?._id) {
          setNotifications(prev => {
            const exists = prev.some(n => n._id === notification._id);
            if (!exists) {
              return [notification, ...prev];
            }
            return prev;
          });
          setUnreadCount(prev => prev + 1);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      return newSocket;
    };

    fetchNotifications();
    const socket = setupSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    let filtered = notifications;
    switch (selectedFilter) {
      case 'unread':
        filtered = notifications.filter(notif => !notif.isRead);
        break;
      case 'payment':
        filtered = notifications.filter(notif => notif.type === 'purchase');
        break;
      case 'booking':
        filtered = notifications.filter(notif => notif.type === 'service');
        break;
      case 'class':
        filtered = notifications.filter(notif => notif.type === 'class');
        break;
      case 'donation':
        filtered = notifications.filter(notif => notif.type === 'donation');
        break;
      default:
        filtered = notifications;
    }
    setFilteredNotifications(filtered);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    setFilteredNotifications(notifications);
  }, [notifications]);

  const markAsRead = async (notificationId, e) => {
    e?.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setSelectedNotification(notification);
    console.log(notification)
  };

  const navigateToReference = () => {
    if (!selectedNotification) return;

    switch (selectedNotification.type) {
      case 'payment':
        navigate(`/payments/${selectedNotification.referenceId}`);
        break;
      case 'booking':
        navigate(`/bookings/${selectedNotification.referenceId}`);
        break;
      case 'class':
        navigate(`/kuliyyah/classes/${selectedNotification.referenceId}`);
        break;
      case 'donation':
        navigate(`/donations/${selectedNotification.referenceId}`);
        break;
      case 'flag':
        navigate('/chat', { state: { inboxUserId: selectedNotification.createdBy } });
        break;
      case 'unflag':
        navigate('/chat', { state: { inboxUserId: selectedNotification.createdBy } });
        break;
      default:
        navigate('/dash');
    }
    setSelectedNotification(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment':
        return '💰';
      case 'booking':
        return '📅';
      case 'class':
        return '📚';
      case 'donation':
        return '🎁';
      default:
        return '📢';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getDetailText = (notification) => {
    switch (notification.type) {
      case 'payment':
        return 'View payment details';
      case 'booking':
        return 'View booking details';
      case 'class':
        return 'View class details';
      case 'donation':
        return 'View donation details';
      case 'flag':
        return 'Reply';
      case 'unflag':
        return 'Reply';
      default:
        return 'View details';
    }
  };

  const renderOrderDetails = (orderData) => {
    console.log(orderData)
    if (!orderData) return null;
  
    switch (orderData.paymentType) {
      case 'service':
        return (
          <div>
            <h3 className="font-semibold">Service Details</h3>
            <p>Status: {orderData.serviceDetails?.status || 'N/A'}</p>
            <p>Service: {orderData.serviceDetails?.name || 'N/A'}</p>
            <p>Date: {orderData.serviceDetails?.date ? new Date(orderData.serviceDetails.date).toLocaleDateString() : 'N/A'}</p>
          </div>
        );
      case 'purchase':
        return (
          <div>
            <h3 className="font-semibold">Purchase Details</h3>
            <p>Total Amount: ${orderData.amount || 'N/A'}</p>
            <p>Items:</p>
            <ul>
              {orderData.items?.map((item, index) => (
                <li key={index}>
                  {item.productId} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
            <p>Delivery Address: {orderData.deliveryAddress ? `${orderData.deliveryAddress.street}, ${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.state} ${orderData.deliveryAddress.postalCode}` : 'N/A'}</p>
          </div>
        );
      case 'donation':
        return (
          <div>
            <h3 className="font-semibold">Donation Details</h3>
            <p>Title: {orderData.donationDetails?.title || 'N/A'}</p>
            <p>Description: {orderData.donationDetails?.description || 'N/A'}</p>
            <p>Amount: RM {orderData?.amount || 'N/A'}</p>
          </div>
        );
      case 'class':
        return (
          <div>
            <h3 className="font-semibold">Class Details</h3>
            <p>Title: {orderData.classDetails?.title || 'N/A'}</p>
            <p>Description: {orderData.classDetails?.description || 'N/A'}</p>
            <p>Start Date: {orderData.classDetails?.startDate ? new Date(orderData.classDetails.startDate).toLocaleDateString() : 'N/A'}</p>
            <p>Start Time: {orderData.classDetails?.startTime || 'N/A'}</p>
            <p>Venue: {orderData.classDetails?.venue || 'N/A'}</p>
          </div>
        );
      default:
        return null;
    }
  };

  // const handleNotificationClick = async (notification) => {
  //   if (!notification.isRead) {
  //     await markAsRead(notification._id);
  //   }
  //   setSelectedNotification(notification);
  // };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold"></h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {[
                  { value: 'all', label: 'All Notifications' },
                  { value: 'unread', label: 'Unread' },
                  { value: 'payment', label: 'Payments' },
                  { value: 'booking', label: 'Bookings' },
                  { value: 'class', label: 'Classes' },
                  { value: 'donation', label: 'Donations' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => handleFilterChange(filterOption.value)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      filter === filterOption.value ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card
            key={notification._id}
            className={`${
              notification.isRead ? 'bg-gray-50' : 'bg-white'
            } cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <span className="mr-2">{getNotificationIcon(notification.type)}</span>
                {notification.title}
              </CardTitle>
              {!notification.isRead && (
                <button
                  onClick={(e) => markAsRead(notification._id, e)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
            </CardContent>
          </Card>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">No notifications yet</div>
        )}
      </div>

      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
  <DialogContent className="sm:max-w-md bg-white">
    <DialogHeader>
      <DialogTitle>{selectedNotification?.title}</DialogTitle>
      <DialogDescription asChild>
        <div className="mt-4 space-y-4">
          <span className="block">{selectedNotification?.message}</span>
          <span className="block text-sm text-gray-500">
            Received on {selectedNotification && formatDate(selectedNotification.createdAt)}
          </span>
          {selectedNotification?.orderData && renderOrderDetails(selectedNotification.orderData)}
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex justify-end space-x-2">
      <Button variant="outline" onClick={() => setSelectedNotification(null)}>
        Close
      </Button>
      <Button onClick={navigateToReference}>
        {selectedNotification && getDetailText(selectedNotification)}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default NotificationPage;