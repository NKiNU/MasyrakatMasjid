import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import MainLayout from '../../components/MainLayout';
import SidebarNavigation from '../../components/SideBar/SideNavBar';
import { classService } from "../../api/classApi";
import { formatPaymentDetails } from '../Checkout/paymentUtils';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const ClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [userRole, setUserRole] = useState('user');
  const {currentUser} = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await classService.getClassesById(id);
        setClassData(data.class);
        
        
        // Check if current user is enrolled
        if (currentUser && data.class.participants) {
          setIsEnrolled(data.class.participants.some(
            participant => participant._id === currentUser._id
          ));
        }
        
        setUserRole(currentUser?.role);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleEnrollClick = async () => {
    try {
      if (isEnrolled) {
        // Handle leaving the class
        await classService.leaveClass(classData._id);
        setIsEnrolled(false);
        Swal.fire({
          icon: 'success',
          title: 'Left Class',
          text: 'You have successfully left the class',
          confirmButtonColor: '#3085d6'
        });
      } else {
        // Handle joining the class
        if (!classData.isPaid) {
          await classService.joinClass(classData._id);
          setIsEnrolled(true);
          Swal.fire({
            icon: 'success',
            title: 'Enrolled!',
            text: 'You have successfully enrolled in the class',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            if (classData.venue === 'online') {
              Swal.fire({
                icon: 'info',
                title: 'Class Link',
                text: 'You will receive the class link via email',
                confirmButtonColor: '#3085d6'
              });
            }
          });
        } else {
          const paymentData = formatPaymentDetails('class', {
            classInfo: {
              _id: classData._id,
              className: classData.className,
              price: classData.price,
              startDate: classData.startDate,
              startTime: classData.startTime,
              venue: classData.venue
            }
          });
          navigate('/checkout', { state: paymentData });
        }
      }
      
      // Refresh class data
      const updatedData = await classService.getClassesById(id);
      setClassData(updatedData.class);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Failed to process your request',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleEdit = () => {
    navigate(`/kuliyyah/editClass/${id}`);
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await classService.deleteClass(id);
          Swal.fire(
            'Deleted!',
            'The class has been deleted.',
            'success'
          ).then(() => {
            navigate('/classes');
          });
        } catch (err) {
          Swal.fire(
            'Error!',
            'Failed to delete the class.',
            'error'
          );
        }
      }
    });
  };

  const isAdmin = userRole === 'admin' || userRole === 'super admin';

  if (loading) return <p>Loading class details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!classData) return <p>No class details found.</p>;

  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          {isAdmin && (
            <div className="mb-6 flex pt-4 justify-end gap-4">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Class
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Class
              </button>
            </div>
          )}



          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image Gallery */}
            <div className="relative h-96">
              <img
                src={classData.images[activeImage]}
                alt={classData.className}
                className="w-full h-full object-cover"
              />
              {classData.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : classData.images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev < classData.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {classData.className}
                  </h1>
                  <p className="text-gray-600">
                    {classData.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Class Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium">{new Date(classData.startDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium">{classData.startTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Venue</p>
                        <p className="font-medium">
                          {classData.venue === 'online' ? 'Online Class' : classData.venueDetails}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">{classData.participants.length} / {classData.capacity} Enrolled</p>
                      </div>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Participants ({classData.participants.length})
                    </h2>
                    <div className="bg-white rounded-lg border border-gray-200">
                      {classData.participants.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {classData.participants.map((participant) => (
                            <div key={participant._id} className="p-4 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {participant.profileImage ? (
                                  <img
                                    src={participant.profileImage}
                                    alt={participant.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-lg font-medium">
                                      {participant.username.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900">{participant.username}</p>
                                  <p className="text-sm text-gray-500">{participant.email}</p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">
                                Joined: {new Date(participant.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No participants yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="mb-6">
          {classData.isPaid ? (
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                RM {classData.price}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-green-600">Free</span>
          )}
        </div>
        {isEnrolled ? (
          <button
            onClick={handleEnrollClick}
            className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-red-700 transition-colors mb-4"
          >
            Leave Class
          </button>
        ) : (
          <button
            onClick={handleEnrollClick}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition-colors mb-4"
            disabled={classData.participants.length >= classData.capacity}
          >
            {classData.participants.length >= classData.capacity ? 'Class Full' : 'Enroll Now'}
          </button>
        )}
        {classData.venue === 'online' && isEnrolled && (
          <p className="text-sm text-gray-600 mt-4">
            You will receive the class link via email
          </p>
        )}
      </div>
    </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ClassDetail;