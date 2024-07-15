import { Router } from "express";
import { authorize, verifyJsonWebToken } from "../middleware/auth.middleware.js";
import {
     getPayments,
     getPaymentById,
     updatePaymentStatus,
     deletePayment,
     verifyPayment
} from "../controllers/payment.controller.js";

const router = Router();

// Route to create a new payment
router.route('/verify-payment').post(verifyJsonWebToken, verifyPayment);

// Route to get all payments (admin only)
router.route('').get(verifyJsonWebToken, authorize('admin', 'super_admin'), getPayments);

// Route to get a specific payment by ID
router.route('/:paymentId').get(verifyJsonWebToken, authorize('admin', 'super_admin'), getPaymentById);

// Route to update payment status
router.route('/:paymentId/update').put(verifyJsonWebToken, authorize('admin', 'super_admin'), updatePaymentStatus);

// Route to delete a payment
router.route('/:paymentId/delete').delete(verifyJsonWebToken, authorize('admin', 'super_admin'), deletePayment);

export default router;
