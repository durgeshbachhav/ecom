// AuthSuccess.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/UserSlice';

function AuthSuccess() {
     const navigate = useNavigate();
     const location = useLocation();
     const dispatch = useDispatch();

     useEffect(() => {
          const params = new URLSearchParams(location.search);
          const userDataParam = params.get('userData');
          const accessToken = params.get('accessToken');
          const refreshToken = params.get('refreshToken');

          if (userDataParam) {
               const userData = JSON.parse(decodeURIComponent(userDataParam));
               console.log('userdata : authsucess : ', userData)

               // Dispatch action to set user in Redux store
               dispatch(setUser(userData));

               // Store user in localStorage
               localStorage.setItem('user', JSON.stringify(userData));
               localStorage.setItem('accessToken', JSON.stringify(accessToken));
               localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

               // Navigate to home page or dashboard
               navigate('/');
          }
     }, [location, navigate, dispatch]);

     return <div>Authentication successful. Redirecting...</div>;
}

export default AuthSuccess;