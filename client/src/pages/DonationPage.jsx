import React from 'react';
import DonationList from '../components/Donations/Donations';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import { useAuth } from "../context/AuthContext";
import AdminDashboard from '../components/Donations/DonationsAdmin';
const DonationPage = () => {
  const { currentUser } = useAuth();
  return (
    <div className='flex h-screen'>
      <div className='w-64 bg-gray-100 dark:bg-gray-800'>
        {<SidebarNavigation/>}
      </div>

      <div className='flex-1 p-6'>
        {currentUser && currentUser?.role === 'admin' || currentUser?.role === 'super admin' ? (
          <AdminDashboard />
        ) : (
          <DonationList />
        )}
      </div>
    </div>
  );
};

export default DonationPage;
