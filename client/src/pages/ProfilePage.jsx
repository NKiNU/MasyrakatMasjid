import React from 'react';
import Profile from '../components/Profile/Profile';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import { useAuth } from "../context/AuthContext";
const ProfilePage = () => {
  const { login, error,user,role } = useAuth();
  return (
    <div className='flex h-screen'>
      <div className='w-64 bg-gray-100 dark:bg-gray-800'>
        {<SidebarNavigation/>}
      </div>

    <div className='flex-1 p-6'>
      {<Profile/>}
      
    </div>
    </div>
  );
};

export default ProfilePage;
