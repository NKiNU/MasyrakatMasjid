import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Package, Briefcase, Heart, GraduationCap } from 'lucide-react';
import {getProductById } from "../../api/productApi"

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/checkout/users/${userId}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
        console.log(data)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getOrderIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <Package className="w-5 h-5" />;
      case 'service':
        return <Briefcase className="w-5 h-5" />;
      case 'donation':
        return <Heart className="w-5 h-5" />;
      case 'class':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!orders.length) return <div className="text-gray-500 text-center py-4">No orders found</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
            onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-gray-600">
                {getOrderIcon(order.paymentType)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {order.orderId}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="font-medium">${order.amount.toFixed(2)}</span>
              {expandedOrder === order.orderId ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedOrder === order.orderId && (
            <div className="px-4 pb-4 border-t border-gray-200">


              {/* Order Details based on type */}
              {order.paymentType === 'purchase' && order.items && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Purchased Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.productId.name
                        } × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {order.deliveryAddress && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city},
                        {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {order.paymentType === 'service' && order.serviceDetails && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>Service: {order.serviceDetails.serviceName}</p>
                    <p>Date: {formatDate(order.serviceDetails.date)}</p>
                    <p>Time: {order.serviceDetails.timeSlot.startTime}</p>
                    {order.serviceDetails.notes && (
                      <p>Notes: {order.serviceDetails.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {order.paymentType === 'donation' && order.donationDetails && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Donation Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>Campaign: {order.donationDetails.title}</p>
                    <p>{order.donationDetails.description}</p>
                  </div>
                </div>
              )}

              {order.paymentType === 'class' && order.classDetails && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Class Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>Class: {order.classDetails.title}</p>
                    <p>Date: {formatDate(order.classDetails.startDate)}</p>
                    <p>Time: {order.classDetails.startTime}</p>
                    <p>Venue: {order.classDetails.venue}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>${order.serviceFee?.toFixed(2) || '0.00'}</span>
                  </div>
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2">
                    <span>Total</span>
                    <span>${order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;