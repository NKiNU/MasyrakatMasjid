// services/api.js
import axios from 'axios';
import { ref, uploadBytes,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imgDB } from "../util/fireabseStorage";

const API_BASE_URL = 'http://localhost:3001/api';

const videoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
videoApi.interceptors.request.use(
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
videoApi.interceptors.response.use(
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

// Helper function to upload files to Firebase
// const uploadToFirebase = async (files, path) => {
//   const uploadPromises = files.map((file) => {
//     const uniqueName = `${Date.now()}-${file.name}`;
//     const storageRef = ref(imgDB, `${path}/${uniqueName}`);
//     return uploadBytes(storageRef, file).then((snapshot) =>
//       getDownloadURL(snapshot.ref)
//     );
//   });
//   return Promise.all(uploadPromises);
// };
const uploadFileWithProgress = (file, path, onProgress) => {
    return new Promise((resolve, reject) => {
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(imgDB, `${path}/${uniqueName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
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

export const videoService = {
    createVideo: async (videoData, videoFile, thumbnailFile, onProgress) => {
        try {
          // Upload video with progress
          const videoUrl = await uploadFileWithProgress(
            videoFile, 
            'videos', 
            (progress) => onProgress('video', progress)
          );
    
          // Upload thumbnail with progress
          const thumbnailUrl = await uploadFileWithProgress(
            thumbnailFile, 
            'thumbnails', 
            (progress) => onProgress('thumbnail', progress)
          );
    
          // Create video entry
          const response = await videoApi.post('/videos', {
            ...videoData,
            videoUrl,
            thumbnailUrl,
          });
    
          return response.data;
        } catch (error) {
          throw error;
        }
      },

  getAllVideos: async (filters = {}) => {
    try {
      const response = await videoApi.get('/videos', { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getVideoById: async (id) => {
    try {
      const response = await videoApi.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateVideo: async (id, updateData, newVideoFile = null, newThumbnailFile = null, onProgress) => {
    try {
      let updates = { ...updateData };

      // Upload new files if provided
      if (newVideoFile) {
        const videoUrl = await uploadFileWithProgress(
          newVideoFile,
          'videos',
          (progress) => onProgress('video', progress)
        );
        updates.videoUrl = videoUrl;
      }

      if (newThumbnailFile) {
        const thumbnailUrl = await uploadFileWithProgress(
          newThumbnailFile,
          'thumbnails',
          (progress) => onProgress('thumbnail', progress)
        );
        updates.thumbnailUrl = thumbnailUrl;
      }

      const response = await videoApi.put(`/videos/${id}`, updates);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteVideo: async (id) => {
    try {
      const response = await videoApi.delete(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getVideosByCategory: async (category) => {
    try {
      // If category is an empty string, fetch all videos
      const endpoint = category ? `/videos/category/${category}` : '/videos';
      const response = await videoApi.get(endpoint);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  searchVideos: async (query) => {
    try {
      const response = await videoApi.get('/videos/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  toggleLike: async (id) => {
    try {
      const response = await videoApi.post(`/videos/${id}/like`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getMostPopular: async (limit = 10) => {
    try {
      const response = await videoApi.get('/videos/popular', { params: { limit } });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getRecent: async (limit = 10) => {
    try {
      const response = await videoApi.get('/videos/recent', { params: { limit } });
      // console.log(response)  
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default videoApi;