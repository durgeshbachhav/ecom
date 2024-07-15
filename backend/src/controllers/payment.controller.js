import { Payment } from '../models/payment.model.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';
import crypto from 'crypto';


// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Public
const verifyPayment = asyncHandler(async (req, res) => {
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, receiptId, orderId } = req.body;
     console.log('verify controller body : ', razorpay_order_id, "============", razorpay_payment_id, "============", razorpay_signature, "============", amount, "============", receiptId, "============", orderId)

     console.log('order Id : ', orderId)
     const sign = razorpay_order_id + "|" + razorpay_payment_id;

     const expectedSign = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(sign.toString())
          .digest("hex");

     const isAuthentic = expectedSign === razorpay_signature;

     if (!isAuthentic) {
          throw new handleError(400, 'Invalid signature');
     }

     // Find the order using orderId
     const order = await Order.findById(orderId);
     console.log('Order search result:', order);
     if (!order) {
          throw new handleError(404, 'Order not found');
     }

     // Create and save the payment
     const payment = await Payment.create({
          orderId: order._id,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          paymentMethod: 'Razorpay',
          amount,
          paymentStatus: 'Completed',
          user: order.userId
     });

     if (!payment) {
          throw new handleError(500, 'Failed to create payment record');
     }

     // Update the order status
     order.status = 'Paid';
     order.isPaymentVerify = true;
     await order.save();

     res.status(200).json(new handleSuccess(200,
          'Payment verified successfully',
          { payment, order }
     ));
});


// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin)
const getPayments = asyncHandler(async (req, res) => {
     const payments = await Payment.find().populate('orderId', 'userId total').populate('user', 'fullName email');
     res.status(200).json({
          success: true,
          data: payments
     });
});

// @desc    Get single payment by ID
// @route   GET /api/payments/:id
// @access  Private (Admin)
const getPaymentById = asyncHandler(async (req, res) => {
     const payment = await Payment.findById(req.params.id).populate('orderId', 'userId total').populate('user', 'fullName email');

     if (!payment) {
          handleError(404, `Payment with ID ${req.params.id} not found`);
     }

     res.status(200).json({
          success: true,
          data: payment
     });
});

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private (Admin)
const updatePaymentStatus = asyncHandler(async (req, res) => {
     const { paymentStatus } = req.body;

     const updatedPayment = await Payment.findByIdAndUpdate(
          req.params.id,
          { paymentStatus },
          { new: true }
     );

     if (!updatedPayment) {
          handleError(404, `Payment with ID ${req.params.id} not found`);
     }

     res.status(200).json({
          success: true,
          message: 'Payment status updated successfully',
          data: updatedPayment
     });
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private (Admin)
const deletePayment = asyncHandler(async (req, res) => {
     const payment = await Payment.findById(req.params.id);

     if (!payment) {
          handleError(404, `Payment with ID ${req.params.id} not found`);
     }

     await payment.remove();

     res.status(200).json({
          success: true,
          message: `Payment with ID ${req.params.id} deleted successfully`
     });
});

export {
     verifyPayment,
     getPayments,
     getPaymentById,
     updatePaymentStatus,
     deletePayment
};
