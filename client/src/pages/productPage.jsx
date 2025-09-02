import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import SidebarNavigation from '../components/SideBar/SideNavBar';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import MainLayout from '../components/MainLayout';

const ProductPage = () => {
  const { user, role } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (<>
  <SidebarNavigation/>
  <MainLayout>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Shop
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
       
          <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
            <ProductList />
          </div>
      

        {/* Floating Cart Button */}
        <Button
          onClick={() => navigate('/service/cart')}
          className="fixed bottom-8 right-8 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </div>
  </MainLayout>
  </>
  );
};

export default ProductPage;