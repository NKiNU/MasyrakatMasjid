import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Calendar, Edit, Trash, Flag, AlertTriangle, Plus, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import serviceApi from '../../api/serviceApi';
import bookingApi from '../../api/bookingApi';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("services");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchServices();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceApi.getServices();
      setServices(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch services',
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const data = currentUser?.role === 'user' 
        ? await bookingApi.getUserBookings()
        : await bookingApi.getAllBookings();
      setBookings(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch bookings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await serviceApi.deleteService(serviceId);
        fetchServices();
        Swal.fire(
          'Deleted!',
          'Service has been deleted.',
          'success'
        );
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete service',
        });
      }
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    const { value: adminNotes } = await Swal.fire({
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} Booking`,
      input: 'textarea',
      inputLabel: 'Admin Notes (optional)',
      inputPlaceholder: 'Enter any notes about this decision...',
      showCancelButton: true,
      confirmButtonText: status === 'approved' ? 'Approve' : 'Reject',
      confirmButtonColor: status === 'approved' ? '#3085d6' : '#d33'
    });

    if (adminNotes !== undefined) {
      try {
        await bookingApi.updateBookingStatus(bookingId, status, adminNotes);
        fetchBookings();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Booking status updated successfully',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update booking status',
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="container mx-auto p-6">
          <header className="bg-white shadow-sm mb-6">
            <div className="max-w-7xl mx-auto py-4 px-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Services & Bookings
              </h1>
            </div>
          </header>

          {/* Custom Tabs */}
          <div className="flex mb-6 border-b gap-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'services'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'bookings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              {currentUser?.role === 'user' ? 'My Bookings' : 'Manage Bookings'}
            </button>
          </div>

          {/* Services Tab Content */}
          {activeTab === 'services' && (
            <>
              {(userRole === 'admin' || userRole === 'super admin') && (
                <div className="mb-4">
                  <button
                    onClick={() => navigate('/service/new')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Service
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-2">${service.price}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Duration: {service.duration}min</p>
                        <div className="flex gap-2">
                          {(userRole === 'admin' || userRole === 'super admin') ? (
                            <>
                              <button
                                className="p-2 text-gray-600 hover:text-blue-600"
                                onClick={() => navigate(`/service/availability/${service._id}`)}
                              >
                                <Clock className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-600 hover:text-blue-600"
                                onClick={() => navigate(`/service/edit/${service._id}`)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-gray-600 hover:text-red-600"
                                onClick={() => handleDelete(service._id)}
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                              onClick={() => navigate(`/service/book/${service._id}`)}
                            >
                              <Calendar className="w-4 h-4" />
                              Book Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Bookings Tab Content */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.serviceId.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot.startTime}
                      </p>
                      {currentUser?.role !== 'user' && (
                        <p className="text-sm">Booked by: {booking.userId?.email}</p>
                      )}
                      {booking.notes && (
                        <p className="text-sm mt-2">Notes: {booking.notes}</p>
                      )}
                      {booking.adminNotes && (
                        <p className="text-sm mt-2 text-gray-700">
                          Admin Notes: {booking.adminNotes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      
                      {(userRole === 'admin' || userRole === 'super admin') && 
                       booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                            onClick={() => handleStatusUpdate(booking._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
                            onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default ServiceList;