import axios from 'axios';

const donateapi = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Intercept requests to attach JWT token
donateapi.interceptors.request.use(
    (config) => {
        console.log("in interceptor: ",localStorage.getItem('token'))
        const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default donateapi;
