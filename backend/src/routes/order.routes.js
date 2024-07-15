import { Router } from "express";
import { authorize, verifyJsonWebToken } from "../middleware/auth.middleware.js";
import { createOrder, deleteOrder, getOrderById, getOrders, getUserOrders, updateOrderStatus } from "../controllers/order.controller.js";


const router = Router();

// Route to create a new order
router.route('').post(verifyJsonWebToken, createOrder);
router.route('/user-orders').get(verifyJsonWebToken, getUserOrders);


// Route to get all orders (admin only)
router.route('').get(verifyJsonWebToken, authorize('admin', 'super_admin'), getOrders);

// Route to get a specific order by ID
router.route('/:orderId').get(verifyJsonWebToken, getOrderById);
router.route('/:orderId').patch(verifyJsonWebToken, authorize('admin', 'super_admin'), updateOrderStatus)
router.route('/:orderId').delete(verifyJsonWebToken, authorize('admin', 'super_admin'), deleteOrder)

export default router;
