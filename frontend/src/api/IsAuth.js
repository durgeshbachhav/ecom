// useAuth.js
import { useState, useEffect } from 'react';
import { axiosInstance } from './AxiosInstace';


export const useAuth = () => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const validateToken = async () => {
               const token = localStorage.getItem('token');
               if (token) {
                    try {
                         const response = await axiosInstance.get('/auth/validate-token');
                         setUser(response.data.user);
                    } catch (error) {
                         localStorage.removeItem('token');
                    }
               }
               setLoading(false);
          };

          validateToken();
     }, []);

     const login = async (credentials) => {
          const response = await axiosInstance.post('/auth/login', credentials);
          localStorage.setItem('token', response.data.token);
          setUser(response.data.user);
     };

     const logout = () => {
          localStorage.removeItem('token');
          setUser(null);
     };

     return { user, loading, login, logout };
};