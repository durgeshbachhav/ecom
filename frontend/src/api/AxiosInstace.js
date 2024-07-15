import axios from 'axios';

// Private API Axios instance

export const axiosInstance = axios.create({
     baseURL: import.meta.env.VITE_APP_API_URL,
     withCredentials: true, // This is important for sending cookies
});


// Add a request interceptor to attach the token to every request
axiosInstance.interceptors.request.use(
     (config) => {
          const token = localStorage.getItem('accessToken');
          console.log('token : ', token);
          if (token) {
               config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
     },
     (error) => {
          return Promise.reject(error);
     }
);

// Public API Axios instance
export const guestAxiosInstance = axios.create({
     baseURL: import.meta.env.VITE_APP_API_URL, // Set your API base URL in environment variables
     headers: {
          'Content-Type': 'application/json',
     },
});
