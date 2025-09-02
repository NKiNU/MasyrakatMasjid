import React from 'react';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import Checkout from '../components/Checkout/Checkout';
const CheckoutPage = () => {
  return (
    <div className='flex h-screen'>
      <div className='w-64 bg-gray-100 dark:bg-gray-800'>
        {<SidebarNavigation/>}
      </div>

    <div className='flex-1 p-6'>
      {<Checkout/>}
      
    </div>
    </div>
  );
};

export default CheckoutPage;
