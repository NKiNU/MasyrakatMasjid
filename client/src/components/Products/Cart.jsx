// pages/CartPage.jsx
import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Minus, Plus, Trash, ArrowLeft, ShoppingBag } from 'lucide-react';
// import SidebarNavigation from '../components/SideBar/SideNavBar';
import toast from 'react-hot-toast';
import {formatPaymentDetails} from '../Checkout/paymentUtils'

const Cart = () => {
  const { cart, cartCount, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart updated:", cart);}
, [cart]);
  

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    console.log(currentUser?.address);
    // const paymentDetails = {
    //   products: cart.map((item) => ({
    //     productId: item.productId._id,
    //     name: item.name,
    //     price: item.price,
    //     quantity: item.quantity,
    //   })),
    // };
  
    // navigate('/checkout', {
    //   state: {
    //     paymentType: 'purchase',
    //     paymentDetails,
    //   },
    // });
    const paymentData = formatPaymentDetails('purchase', {
      cart,
      deliveryAddress: currentUser?.address // Assuming you have user's address
    });
    
    navigate('/checkout', { state: paymentData });
  };

//   if (!currentUser) {
//     return (
//       <div className="flex h-screen bg-gray-50">
//         <div className="w-64">
//           <SidebarNavigation />
//         </div>
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
//             <h2 className="mt-2 text-lg font-medium text-gray-900">Please login to view your cart</h2>
//             <Button className="mt-4" onClick={() => navigate('/login')}>
//               Login
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <div className="w-64">
        <SidebarNavigation />
      </div> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/service/shop')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
               
              </button>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your cart...</p>
              </div>
            ) : cartCount === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
                <Button className="mt-4" onClick={() => navigate('/service/shop')}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    {cart.map((item) => (
                      <div key={item._id} className="p-6">
                        <div className="flex items-center space-x-6">
                        <img
  src={item.productId.img && item.productId.img[0] ? item.productId.img[0] : 'default-image-url.jpg'}
  alt={item.name}
  className="w-24 h-24 object-cover rounded-md"
/>

                          <div className="flex-1">
                            <p className="text-lg text-gray-900">{item.name}</p>
                            <p className="mt-1 text-sm text-gray-500">RM {item.price}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.productId._id, item.quantity, -1)}
                                className="p-2 hover:bg-gray-100"
                                disabled={loading}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.productId._id, item.quantity, 1)}
                                className="p-2 hover:bg-gray-100"
                                disabled={loading}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveItem(item._id)}
                              disabled={loading}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white shadow sm:rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between space-x-4">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      disabled={loading}
                      className="flex-1"
                    >
                      Clear Cart
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="flex-1"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;