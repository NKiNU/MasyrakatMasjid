import React from 'react';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import PaymentGateway from '../components/Checkout/Payment';
const PaymentPage = () => {
  return (
    <div className='flex h-screen'>
      <div className='w-64 bg-gray-100 dark:bg-gray-800'>
        {<SidebarNavigation/>}
      </div>

    <div className='flex-1 p-6'>
      {<PaymentGateway/>}
      
    </div>
    </div>
  );
};

export default PaymentPage;
