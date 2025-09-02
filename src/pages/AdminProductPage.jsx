import React from 'react';
import ManageProducts from '../components/Products/ManageProducts';
import ProductList from '../components/Products/ProductList';
import SidebarNavigation from '../components/SideBar/SideNavBar';
const AdminProductPage = () => {
  return (
        <div className='flex h-screen '>
        <div className='w-64 bg-gray-100 dark:bg-gray-800'>
          {<SidebarNavigation/>}
        </div>
  
      <div className='flex-1 p-6 content-center bg-slate-300'>
        <ProductList/>
      <ManageProducts />
        
      </div>
      </div>
  );
};

export default AdminProductPage ;
