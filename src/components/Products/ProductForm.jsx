import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imgDB } from "../../util/fireabseStorage";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, getProductById, updateProduct } from "../../api/productApi";
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import Swal from 'sweetalert2';
import MainLayout from '../MainLayout';
import SidebarNavigation from '../SideBar/SideNavBar';

const ProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [product, setProduct] = useState({
    img: [],
    name: "",
    price: 0,
    description: "",
    stock: 0,
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const mode = id ? "edit" : "add";
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id, localStorage.getItem('token'));
        setProduct(data.product);
        setImagePreviews(data.product.img || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Product',
          text: 'Failed to load product details. Please try again.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate('/products');
        });
      }
    };

    if (mode === "edit" && id) {
      fetchProduct();
    }
  }, [mode, id, user, navigate]);

  const validateForm = () => {
    if (!product.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Product Name',
        text: 'Please enter a product name',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    if (product.price <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Price',
        text: 'Please enter a valid price greater than 0',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    if (product.stock < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Stock',
        text: 'Stock cannot be negative',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    if (mode === 'add' && imageFiles.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Images',
        text: 'Please add at least one product image',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + imagePreviews.length > 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Too Many Images',
        text: 'You can only upload a maximum of 4 images',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isUnderSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValid && isUnderSize;
    });

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Files',
        text: 'Some files were skipped. Please ensure all files are images under 5MB',
        confirmButtonColor: '#3085d6'
      });
    }

    const newPreviews = [];
    const newFiles = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
      newFiles.push(file);
    });

    setImageFiles([...imageFiles, ...newFiles]);
  };

  const handleRemoveImage = async (index) => {
    const result = await Swal.fire({
      title: 'Remove Image',
      text: 'Are you sure you want to remove this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    });

    if (result.isConfirmed) {
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      if (mode === "edit") {
        setProduct((prev) => ({
          ...prev,
          img: prev.img.filter((_, i) => i !== index),
        }));
      }
    }
  };

  const uploadFiles = async (files) => {
    try {
      const uploadPromises = files.map((file) => {
        const uniqueName = `${Date.now()}-${file.name}`;
        const storageRef = ref(imgDB, `products/${uniqueName}`);
        return uploadBytes(storageRef, file).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      throw new Error('Failed to upload images');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Show loading state
      Swal.fire({
        title: 'Saving Product',
        text: 'Please wait while we save your product...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let imageUrls = [];

      if (imageFiles.length > 0) {
        const newImageUrls = await uploadFiles(imageFiles);
        imageUrls = mode === "edit" ? [...product.img, ...newImageUrls] : newImageUrls;
      } else {
        imageUrls = product.img;
      }

      const productData = { ...product, img: imageUrls };

      if (mode === "add") {
        await addProduct(productData);
      } else if (mode === "edit") {
        await updateProduct(id, productData, localStorage.getItem('token'));
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Product ${mode === 'add' ? 'added' : 'updated'} successfully`,
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate("/service/shop");
      });

    } catch (error) {
      console.error("Error saving product:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${mode} product. Please try again.`,
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: 'Discard Changes?',
      text: 'Are you sure you want to discard your changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard',
      cancelButtonText: 'No, keep editing'
    });

    if (result.isConfirmed) {
      navigate("/products");
    }
  };

  return (
    <>
      <SidebarNavigation />
      <MainLayout>
        <div className="container mx-auto p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-semibold mb-6">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h1>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Product Images</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.length < 4 && (
                      <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                          multiple
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-gray-500">Add Images</span>
                          <span className="text-sm text-gray-400 mt-1">Max 4 images</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter product name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price (RM)</label>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Update Product'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ProductForm;