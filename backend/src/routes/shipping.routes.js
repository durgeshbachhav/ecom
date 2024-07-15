import { Router } from 'express';
import { authorize, verifyJsonWebToken } from '../middleware/auth.middleware.js';
import { createShipping, getAllDeliveries, getShipping, updateShippingStatus } from '../controllers/shipping.controller.js';


const router = Router();

// Apply the verifyJsonWebToken middleware to all routes
router.use(verifyJsonWebToken,authorize('admin', 'super_admin'));

// Route to create a new shipping
router.post('/', createShipping);

// Route to get shipping details by ID
router.get('/:id', getShipping);

// Route to update shipping status by ID
router.put('/:id', updateShippingStatus);

// Route to get all deliveries
router.get('/', getAllDeliveries);

export default router;
