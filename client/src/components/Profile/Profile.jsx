
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { imgDB } from "../../util/fireabseStorage"; // Import the storage from your firebaseConfig file


const ProfileImage = ({ src }) => {
  const [imgError, setImgError] = useState(false);
  const defaultImage = "C:\Users\acer\Desktop\MM2\client\src\assets\default-avatar.jpg";

  return (
    
    <img
      src={imgError ? defaultImage : (src || defaultImage)}
      alt="Profile"
      className="w-full rounded-full"
      onError={() => setImgError(true)}
    />
  );
};

const Profile = () => {
  const [user, setUser] = useState({
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
  });
  const [newPassword, setNewPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { role } = useAuth();

  useEffect(() => {
    console.log(localStorage.getItem(user));
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assume JWT is stored in localStorage
        const response = await axios.get("http://localhost:3001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!role) {
    console.log("printed in profile" + role);
    return <div>Loading...</div>;
  }
  console.log("printed in profile" + role);

  const uploadFiles = async (files) => {
    const uploadPromises = [];
    for (const file of files) {
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(imgDB, `profile/${uniqueName}`);
      const uploadTask = uploadBytes(storageRef, file).then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );
      uploadPromises.push(uploadTask);
    }
    return Promise.all(uploadPromises);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadFiles(imageFiles);
      const updatedUser = { ...user, profileImage: imageUrl[0] };
      const token = localStorage.getItem("token");
      const response = await axios.put("/api/profile/me", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Update the user state with the new data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const toggleEmailNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = {
        ...user,
        emailNotifications: !user.emailNotifications,
      };
      const response = await axios.put(
        "/api/profile/email-notifications",
        { emailNotifications: updatedUser.emailNotifications },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error toggling email notifications:", error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/profile/upload-image", formData);
      setUser({ ...user, profileImage: response.data.imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const initiatePasswordChange = async () => {
    try {
      await axios.post("/api/auth/initiate-password-change", {
        email: user.email,
      });
      setShowVerification(true);
    } catch (error) {
      console.error("Error initiating password change:", error);
    }
  };

  const verifyAndChangePassword = async () => {
    try {
      await axios.post("/api/auth/change-password", {
        email: user.email,
        code: verificationCode,
        newPassword,
      });
      setShowVerification(false);
      setNewPassword("");
      setVerificationCode("");
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };


  return (
    <div className="flex p-6 max-w-4xl mx-auto">
<div className="w-1/4 mr-8">
  <div className="mb-4">
    <ProfileImage src={user.profileImage} />
    <input
      type="file"
      accept=".jpg,.jpeg,.png"
      onChange={handleImageChange}
      className="mt-2"
    />
    <p className="text-sm text-gray-500">Max size: 1MB</p>
    <p className="text-sm text-gray-500">Formats: JPEG, PNG</p>
  </div>
</div>

      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <p className="text-gray-600 mb-6">Manage and protect your account</p>

        <form className="space-y-4">
          <div className="flex items-center">
            <label className="w-32">Username</label>
            <span>{user.username}</span>
          </div>


          <div className="flex items-center">
            <label className="w-32">Email</label>
            <span>{user.email}</span>
            <button type="button" className="ml-2 text-blue-500">
              Change
            </button>
          </div>

          <div className="flex items-center">
            <label className="w-32">Phone</label>
            <span>{user.phone}</span>
            <button type="button" className="ml-2 text-blue-500">
              Change
            </button>
          </div>

          <div className="flex items-center">
            <label className="w-32">Gender</label>
            <div className="space-x-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={user.gender === "Male"}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={user.gender === "Female"}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                />{" "}
                Female
              </label>
            </div>
          </div>

          <div>
            <label className="w-32 block mb-2">Change Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="border rounded px-2 py-1 mb-2"
            />
            <button
              type="button"
              onClick={initiatePasswordChange}
              className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
            >
              Change Password
            </button>
          </div>

          <div className="flex items-center">
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={user.emailNotifications} // Bind to the state
      onChange={toggleEmailNotifications} // Handle toggle event
      className="sr-only peer"
    />
    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
      Email Notifications
    </span>
  </label>
</div>


          {showVerification && (
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={verifyAndChangePassword}
                className="ml-2 bg-green-500 text-white px-4 py-1 rounded"
              >
                Verify & Change
              </button>
            </div>
          )}

          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-1 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
