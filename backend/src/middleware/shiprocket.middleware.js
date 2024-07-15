import axios from 'axios';
import 'dotenv/config';
import { handleError } from '../utils/handleError.js';

let authToken = null;

const authenticateShiprocket = async () => {
     try {
          const response = await axios.post(`${process.env.SHIPROCKET_BASE_URL}/v1/external/auth/login`, {
               email: process.env.SHIPROCKET_EMAIL,
               password: process.env.SHIPROCKET_PASSWORD,
          });

          if (response.data.token) {
               authToken = response.data.token;
               console.log('Successfully authenticated with Shiprocket, token obtained');
          } else {
               throw new Error('Failed to obtain authentication token from Shiprocket');
          }
     } catch (error) {
          console.error('Error during Shiprocket authentication:', error.message);
          throw new Error('Authentication with Shiprocket failed');
     }
};

export const ensureAuthenticated = async (req, res, next) => {
     try {
          if (!authToken) {
               await authenticateShiprocket();
          }

          req.headers['Authorization'] = `Bearer ${authToken}`;
          next();
     } catch (error) {
          return handleError(500, error.message || 'Error while ensuring authentication', res);
     }
};
