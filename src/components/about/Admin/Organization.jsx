import React, { useState, useEffect } from 'react';
import { Upload, X, Maximize2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imgDB } from "../../../util/fireabseStorage";
import Swal from 'sweetalert2';

const Organization = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [images, setImages] = useState([]);
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/org');
      const data = response.data;
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(imgDB, `organization/${uniqueName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleImage = async (file) => {
    if (file) {
      Swal.fire({
        title: 'Uploading Image',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      try {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
  
        const imageUrl = await uploadImage(file);
        const token = localStorage.getItem('token');
  
        const response = await axios.post('http://localhost:3001/api/org', {
          imageUrl,
          uploadedBy: currentUser?._id,
          uploadedAt: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200 || response.status === 201) {
          setPreview(null);
          setSelectedImage(null);
          fetchImages();
          Swal.fire({
            icon: 'success',
            title: 'Image Uploaded',
            text: 'Your organization chart has been successfully uploaded!',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: error.response?.data?.message || 'Failed to upload organization chart',
        });
      }
    }
  };



const handleDelete = async (imageId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:3001/api/org/${imageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          fetchImages();
          Swal.fire(
            'Deleted!',
            'Your image has been deleted.',
            'success'
          );
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        Swal.fire(
          'Error!',
          'Failed to delete the image.',
          'error'
        );
      }
    }
  });
};

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          Organization Chart
        </h1>

        {isAdmin && (
          <div
            className={`relative rounded-xl p-8 mb-8 transition-all
              ${isDragging
                ? 'bg-blue-50 border-2 border-blue-400'
                : 'bg-white shadow-xl border border-gray-200'}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              handleImage(file);
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImage(e.target.files[0])}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="block cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full max-h-[400px] rounded-lg shadow-lg"
                  />
                ) : (
                  <>
                    <div className="mb-4 p-4 rounded-full bg-blue-50">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      Drop your image here or click to upload
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Supports: JPG, PNG, GIF (Max 10MB)
                    </p>
                  </>
                )}
              </div>
            </label>
            {preview && (
              <button
                onClick={() => {
                  setPreview(null);
                  setSelectedImage(null);
                }}
                className="mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-700
                         border border-red-200 rounded-lg hover:bg-red-50
                         transition-colors duration-200"
              >
                Remove Image
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="mb-4 p-4 rounded-full bg-gray-100">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-700">
                No organization charts available
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {isAdmin 
                  ? "Upload an organization chart to get started"
                  : "Check back later for updated organization charts"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid">
            {images.map((image) => (
              <div key={image._id} className="relative group">
                {currentUser?.role === 'user' ? (
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={image.imageUrl}
                      alt="Organization Chart"
                      className="w-full cursor-pointer"
                      onClick={() => setIsFullscreen(image._id)}
                    />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={image.imageUrl}
                      alt="Organization Chart"
                      className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setIsFullscreen(image._id)}
                    />
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(image._id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => setIsFullscreen(image._id)}
                      className="absolute bottom-2 right-2 p-2 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isFullscreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(null)}
          >
            <img
              src={images.find(img => img._id === isFullscreen)?.imageUrl}
              alt="Fullscreen"
              className="max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-white rounded-full"
              onClick={() => setIsFullscreen(null)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organization;