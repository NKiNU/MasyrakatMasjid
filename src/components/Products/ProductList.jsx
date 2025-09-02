// components/ProductList.js
import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../api/productApi';
import { useAuth } from "../../context/AuthContext";
import { useCart } from '../../context/CartContext';
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Edit, Trash, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageViewer from '../ImageViewer';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { currentUser } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleImageClick = (e, image) => {
    e.stopPropagation();
    setSelectedImage(image);
  };

  const handleEdit = (e, productId) => {
    e.stopPropagation();
    navigate(`/products/edit/${productId}`);
  };

  const handleDelete = async (e, productId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await deleteProduct(productId, token);
        setIsDialogOpen(false);
        fetchProducts();
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    try {
      if (!currentUser) {
        toast.error('Please login to add items to cart');
        return;
      }
      const success = await addToCart(product);
      if (success) {
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Failed to add to cart');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="container mx-auto p-6">
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-6">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Products
              </h1>
              {currentUser && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/service/cart')}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  View Cart
                </Button>
              )}
            </div>
          </header>

          {(userRole === 'admin' || userRole === 'superadmin') && (
            <div className="mb-4 mt-4">
              <Button 
                onClick={() => navigate('/products/add')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </Button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.img[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={(e) => handleImageClick(e, product.img[0])}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2">${product.price}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      <div className="flex gap-2">
                        {(userRole === 'admin' || userRole === 'superadmin') ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleEdit(e, product._id)}
                              disabled={cartLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => handleDelete(e, product._id)}
                              disabled={cartLoading}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={cartLoading || product.stock === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {cartLoading ? 'Adding...' : 'Add to Cart'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl bg-white p-6">
              {selectedProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.img.map((image, index) => (
                        <div
                          key={index}
                          className="cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => handleImageClick(e, image)}
                        >
                          <img
                            src={image}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-48 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">{selectedProduct.name}</h2>
                    <p className="text-xl">${selectedProduct.price}</p>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                    <p className="text-sm">Stock: {selectedProduct.stock}</p>
                    {(userRole === 'admin' || userRole === 'super admin') ? (
                      <div className="flex gap-2">
                        <Button onClick={(e) => handleEdit(e, selectedProduct._id)}>Edit</Button>
                        <Button
                          variant="destructive"
                          onClick={(e) => handleDelete(e, selectedProduct._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={(e) => handleAddToCart(e, selectedProduct)}
                        disabled={selectedProduct.stock === 0}
                      >
                        {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <ImageViewer
            image={selectedImage}
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        </div>
      </MainLayout>
    </>
  );
};

export default ProductList;