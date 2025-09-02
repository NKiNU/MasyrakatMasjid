import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import Cart from '../components/Products/Cart';

const CartPage = () => {


  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Cart />

      </div>
    </div>
  );
};

export default CartPage;