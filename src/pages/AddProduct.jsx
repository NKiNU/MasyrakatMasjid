import React from 'react'
import ProductFormPicture from '../components/Products/ProductForm'
import { Box } from '@mui/material';
import { addProduct } from '../api/productApi';
import SidebarNavigation from '../components/SideBar/SideNavBar';

function AddProduct() {




        // Call API or service to add product
      
  return (

            <div className='flex h-screen'>
            <div className='w-64 bg-gray-100 dark:bg-gray-800'>
              {<SidebarNavigation/>}
            </div>
      
          <div className='flex-1 p-6'>
          <ProductFormPicture mode="add"/>
            
          </div>
          </div>
  )
}


export default AddProduct