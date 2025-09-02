import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Pencil, 
  Trash2, 
  UserCircle, 
  Calendar, 
  User, 
  ShoppingCart, 
  Book 
} from 'lucide-react';
import axios from 'axios';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';
import UserForm from '../Profile/UserForm';
import OrderHistory from './OrderHistory';
import JoinedClasses from './JoinedClasses'; 

const ViewProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    profileImage: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    role: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUser(userResponse.data);
        console.log("get auth user 2", userResponse.data)
        
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = id 
          ? `http://localhost:3001/api/auth/user/${id}`
          : 'http://localhost:3001/api/auth/me';
        
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user profile");
      }
    };

    fetchUserData();
  }, [id]);


  const handleEdit = () => {
    console.log("button clicked", id)
    navigate(`/profile/edit/${id ||currentUser._id}`);
  };


  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3001/api/auth/users/${id || currentUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!id) {
        // If deleting own account
        logout();
        navigate('/login');
      } else {
        // If super admin deleting another account
        navigate('/about');
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleCalendarNavigate = () => {
    navigate('/calendar');
  };

  const isAuthorized = currentUser?.role === 'super admin' || user.username === currentUser?.username;
    // Super admin has full access to all profiles
    const isSuperAdmin = currentUser?.role === 'super_admin';

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


  console.log();

  const tabs = [
    { 
      key: 'profile', 
      label: 'Profile', 
      icon: <User className="w-4 h-4 mr-2" /> 
    },
    { 
      key: 'orders', 
      label: 'Order History', 
      icon: <ShoppingCart className="w-4 h-4 mr-2" /> 
    },
    { 
      key: 'classes', 
      label: 'Joined Classes', 
      icon: <Book className="w-4 h-4 mr-2" /> 
    }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Username</label>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="text-gray-900">{user.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="text-gray-900">
                    {user.address.street ? `${user.address.street}, ` : 'Not provided'}
                    {user.address.city ? `${user.address.city}, ` : ''}
                    {user.address.state ? `${user.address.state} ` : ''}
                    {user.address.postalCode || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email Notifications</label>
                  <p className="text-gray-900">
                    {user.emailNotifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return <OrderHistory userId={id || currentUser?._id} />;
      case 'classes':
        return <JoinedClasses userId={id || currentUser?._id} />;
      default:
        return null;
    }
  };

  if (!id && currentUser?.role === 'super admin') {
    return (
      <>
        <SidebarNavigation />
        <MainLayout>
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h1>
            <UserForm />
          </div>
        </MainLayout>
      </>
    );
  }

  return (<>
  <SidebarNavigation/>
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
      {isSuperAdmin && id && (
          <div className="mb-4">
            <button
              onClick={() => navigate('/users')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Users List
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
            <div className="absolute -bottom-16 left-6">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.jpg';
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  <UserCircle className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {isAuthorized && (
              <div className="absolute top-4 right-4 space-x-2">
                <button
                  onClick={handleCalendarNavigate}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </button>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </button>
              </div>
            )}
          </div>

          <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || user.username}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user.role}
              </span>
            </div>

              {/* Tab Navigation */}
              <div className="flex border-b mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex items-center px-4 py-2 -mb-px border-b-2 mr-1
                      ${activeTab === tab.key 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'}
                    `}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Content */}
              <div className="mt-4">
                {renderTabContent()}
              </div>
            </div>


        </div>
        {/* <div className="mt-8 bg-white rounded-lg shadow-md p-6">
  <OrderHistory userId={id || currentUser?._id} />
</div>
<div className="mt-8 bg-white rounded-lg shadow-md p-6">
  <JoinedClasses userId={id || currentUser?._id} />
</div> */}
  
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {id ? 'this' : 'your'} account? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </MainLayout>
      </>
    );

};

export default ViewProfile;