// import axios from 'axios';

// const API_URL = 'http://localhost:3001/api/products';

// export const getProducts = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// export const addProduct = async (productData, token) => {
//   try {
//     const response = await axios.post(
//       API_URL,
//       productData,
//       {
//         headers: { Authorization: `Bearer ${token}` } // Send the token in the request header
//       }
//     );
//     console.log(response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error adding product at api:", error);
//     throw error; // Rethrow the error if you want to handle it further up the call stack
//   }
// };


// export const updateProduct = async (id, productData, token) => {
//   const response = await axios.put(`${API_URL}/${id}`, productData, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// export const deleteProduct = async (id, token) => {
//   const response = await axios.delete(`${API_URL}/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// export const getProductById = async (id, token) => {
//   try {
//     const response = await axios.get(`${API_URL}/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     throw error; // Rethrow the error for further handling
//   }
// };
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const serviceApi = {
  getServices: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/services`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  },

  getServiceById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/services/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  },

  createService: async (serviceData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/services`, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  },

  updateService: async (id, serviceData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/services/${id}`, serviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  },

  deleteService: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  flagService: async (id, isFlagged) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/services/${id}/flag`, 
      { isFlagged },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};

export default serviceApi;
