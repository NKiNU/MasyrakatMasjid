// newsApi.js
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { imgDB } from "../util/fireabseStorage";

const API_URL = 'http://localhost:3001/api';

const uploadImages = async (files) => {
  const uploadPromises = files.map((file) => {
    const uniqueName = `${Date.now()}-${file.name}`;
    const storageRef = ref(imgDB, `news/${uniqueName}`);
    return uploadBytes(storageRef, file).then((snapshot) =>
      getDownloadURL(snapshot.ref)
    );
  });
  return Promise.all(uploadPromises);
};

export const newsService = {
  // Get all news
  getAllNews: async () => {
    try {
      const response = await axios.get(`${API_URL}/news`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch news');
    }
  },

  // Get single news by ID
  getNews: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/news/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch news details');
    }
  },

  // Create new news with images
  createNews: async (newsData, imageFiles) => {
    try {
      // First upload images if any
      let imageUrls = [];
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await uploadImages(imageFiles);
      }

      // Create news with image URLs
      const dataToSend = {
        ...newsData,
        images: [...(newsData.images || []), ...imageUrls],
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(`${API_URL}/news`, dataToSend);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create news');
    }
  },

  // Update existing news
  updateNews: async (id, newsData, newImageFiles) => {
    try {
      // Upload new images if any
      let newImageUrls = [];
      if (newImageFiles && newImageFiles.length > 0) {
        newImageUrls = await uploadImages(newImageFiles);
      }

      // Combine existing and new image URLs
      const dataToSend = {
        ...newsData,
        images: [...(newsData.images || []), ...newImageUrls],
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(`${API_URL}/news/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update news');
    }
  },

  // Delete news
  deleteNews: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/news/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete news');
    }
  },

  // Get featured/highlighted news
  getFeaturedNews: async () => {
    try {
      const response = await axios.get(`${API_URL}/news/featured`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured news');
    }
  },

  // Get news by date range
  getNewsByDateRange: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/news/range`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch news by date range');
    }
  }
};

// Types for TypeScript (if using TS)
// export interface NewsData {
//   title: string;
//   content: string;
//   eventDate: string;
//   isHighlighted: boolean;
//   author: string;
//   images?: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }