import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCircle, Save, X, Trash2,Camera } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imgDB } from '../../util/fireabseStorage';
import axios from 'axios';

const ProfileImage = ({ src, onImageChange, onRemoveImage }) => {
    const [imgError, setImgError] = useState(false);
    const defaultImage = "/default-avatar.jpg";
    const [showControls, setShowControls] = useState(false);
      
  
    return (
      <div className="text-center relative">
        <div
          className="relative"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <img
            src={imgError ? defaultImage : src || defaultImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white mx-auto"
            onError={() => setImgError(true)}
          />
  
          {/* Overlay controls */}
          {showControls && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex flex-col items-center justify-center gap-2">
              <label
                htmlFor="file-input"
                className="cursor-pointer p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
              <input
                id="file-input"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={onImageChange}
                className="hidden"
              />
              {src && (
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  

const EditProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: {
      date: "",
      month: "",
      year: "",
    },
    profileImage: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    emailNotifications: false
  });
 // State for password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Extract the id parameter from the route
        const [currentUserResponse, specificUserResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`http://localhost:3001/api/auth/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setFormData(specificUserResponse.data);
        console.log(specificUserResponse.data)
        setCurrentUserData(currentUserResponse.data);
        setImagePreview(specificUserResponse.data.ProfileImage)
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
    // Handle password changes
    const handlePasswordChange = (e) => {
      const { name, value } = e.target;
      setPasswordData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (1MB = 1048576 bytes)
      if (file.size > 5048576) {
        alert('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('File must be JPEG or PNG format');
        return;
      }
      setImageFile(file);

       // Create preview URL
       const previewUrl = URL.createObjectURL(file);
       console.log('Preview URL:', previewUrl); // Debugging
       setFormData(prev => ({
         ...prev,
         profileImage: previewUrl,
       }));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      const uniqueName = `${Date.now()}-${imageFile.name}`;
      const storageRef = ref(imgDB, `profile/${uniqueName}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageUrl = formData.profileImage;
      
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const updatedFormData = {
        ...formData,
        profileImage: imageUrl
      };

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/auth/users/${formData._id}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
            // Update password if fields are filled
      if (passwordData.currentPassword && passwordData.newPassword) {
        await axios.post(
          `http://localhost:3001/api/auth/change-password/${formData._id}`,
          {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Password updated successfully!");
      }
      if(currentUserData.username !== formData.username){
        navigate('/about');
      }
      navigate('/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }
  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      profileImage: ""
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
          <div className="absolute -bottom-16 left-6">
            <ProfileImage 
              src={formData.profileImage} 
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="pt-20 px-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Rest of the form fields remain the same */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Current Password
                    </label>
                    <input type="password"
                    name='currentPassword'
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className='w-full p-2 border rounded-md' 
                    />
                  </div>

                </div>
                
                
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: 'emailNotifications',
                        value: e.target.checked
                      }
                    })}
                    className="h-4 w-4"
                  />
                  <label className="text-sm text-gray-500">Enable Email Notifications</label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

