import React from 'react';
import ServiceForm from '../components/Service/ServiceForm';
import SidebarNavigation from '../components/SideBar/SideNavBar';
const DonationPage = () => {
  return (
    <div className='flex h-screen'>
      <div className='w-64 bg-gray-100 dark:bg-gray-800'>
        {<SidebarNavigation/>}
      </div>

    <div className='flex-1 p-6'>
      {<ServiceForm/>}
      
    </div>
    </div>
  );
};

export default DonationPage;
