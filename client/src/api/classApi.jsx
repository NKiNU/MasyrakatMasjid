// services/api.js
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imgDB } from "../util/fireabseStorage";

const API_BASE_URL = 'http://localhost:3001/api';

const classApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
classApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
classApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const classService = {
  createClass: async (classData, imageFiles) => {
    try {
        console.log("in the log")
      // First upload images to Firebase
      const imageUrls = await uploadImagesToFirebase(imageFiles);
      console.log("image uploaded")
      
      // Create class with image URLs
      const response = await classApi.post('/classes', {
        ...classData,
        images: imageUrls,
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getClasses: async (filters = {}) => {
    try {
      const response = await classApi.get('/classes', { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getClassesById: async (classId) => {
    try {
      const response = await classApi.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  

  joinClass: async (classId) => {
    try {
      const response = await classApi.post(`/classes/${classId}/join`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateClass: async (classId, updateData, newImageFiles = []) => {
    try {
      // First handle any new images
      let imageUrls = [];
      if (newImageFiles && newImageFiles.length > 0) {
        imageUrls = await uploadImagesToFirebase(newImageFiles);
      }
  
      // Combine existing and new images
      const updatedImages = updateData.images ? [...updateData.images] : [];
      if (imageUrls.length > 0) {
        updatedImages.push(...imageUrls);
      }
  
      // Send update request
      const response = await classApi.put(`/classes/${classId}`, {
        ...updateData,
        images: updatedImages,
      });
  
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteClass: async (classId) => {
    try {
      const response = await classApi.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  leaveClass: async (classId) => {
    try {
      const response = await classApi.post(`/classes/${classId}/leave`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

};

// Helper function to upload images to Firebase
const uploadImagesToFirebase = async (files) => {
  const uploadPromises = files.map((file) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(imgDB, `classes/${uniqueName}`);
    return uploadBytes(storageRef, file).then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );
  });
  return Promise.all(uploadPromises);
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Request setup error
    throw new Error('Error setting up request');
  }
};

export default classApi;


