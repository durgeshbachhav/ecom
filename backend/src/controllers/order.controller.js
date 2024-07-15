import { Order, ORDER_STATUS_ENUM } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';
import {
     sendOrderStatusUpdateEmail
} from './notification.controller.js';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config();
console.log(process.env.RAZORPAY_KEY_ID);
console.log(process.env.RAZORPAY_KEY_SECRET);

const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET
});



// @desc    Get all orders
// @route   GET /api/orders
// @access  private(user)
const createOrder = asyncHandler(async (req, res) => {
     const { userId, products, total, addressId, currency = "INR", notes } = req.body;
     const receiptId = `order_rcptid_${Date.now()}`;
     console.log('address id : ', addressId);
     console.log('create order boyd data ===', userId, products, total, addressId, currency, notes);

     // Verify that the address exists for the user
     const user = await User.findById(userId);
     if (!user) {
          throw new handleError(404, 'User not found');
     }
     console.log('user : ', user);
     const address = user.addresses.id(addressId);
     if (!address) {
          throw new handleError(404, 'Address not found for this user');
     }
     console.log('address find : ', address);

     // Create the Order document in your database
     const newOrder = await Order.create({
          userId,
          products,
          total,
          addressId,
          receiptId,
          status: 'Pending'
     });
     console.log('new order : ', newOrder)
     if (!newOrder) {
          throw new handleError(500, 'Error creating order in database');
     }

     const options = {
          amount: Math.round(total * 100), // Convert to paise and ensure it's an integer
          currency,
          receipt: receiptId,
          notes
     };
     console.log('options : ', options);

     try {
          const razorpayOrder = await razorpay.orders.create(options);
          console.log('razorpay order creation : ', razorpayOrder);
          res.status(200).json(new handleSuccess(true, 'Order created successfully', {
               ...razorpayOrder,
               orderId: newOrder._id,
               receiptId
          }));
     } catch (error) {
          console.error('Razorpay Order Creation Error:', error);
          // Delete the created order from database if Razorpay order creation fails
          await Order.findByIdAndDelete(newOrder._id);
          throw new handleError(500, 'Error creating Razorpay order');
     }
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (user)
const getOrderById = asyncHandler(async (req, res) => {
     const { orderId } = req.params

     const order = await Order.findById(orderId).populate('userId', 'fullName email addresses');

     if (!order) {
          handleError(404, `Order with ID ${orderId} not found`);
     }
     // Find the correct address
     const address = order.userId.addresses.id(order.addressId);

     return res.status(200).json(new handleSuccess(true, 'Order details retrieved successfully', {
          ...order.toObject(),
          address
     }));
});

// @desc    Get orders by user ID
// @route   GET /api/orders/user-orders
// @access  Private(user)
const getUserOrders = asyncHandler(async (req, res) => {
     const userId = req.user._id; // Assuming you have authentication middleware that sets req.user

     if (!userId) {
          throw new handleError(400, 'User ID is required');
     }

     const orders = await Order.find({ userId })
          .populate('products.productId', 'name image') // Populate product details
          .sort({ orderDate: -1 }); // Sort by order date, newest first

     if (!orders || orders.length === 0) {
          return res.status(200).json(new handleSuccess(true, 'No orders found for this user', []));
     }

     console.log('orders : ', orders);
     const formattedOrders = orders.map(order => ({
          _id: order._id,
          total: order.total,
          status: order.status,
          orderDate: order.orderDate,
          isPaymentVerify: order.isPaymentVerify,
          receiptId: order.receiptId,
          products: order?.products?.map(product => ({
               productId: product?.productId?._id,
               name: product?.productId?.name,
               image: product?.productId?.image,
               quantity: product?.quantity,
               price: product?.price
          }))
     }));

     res.status(200).json(new handleSuccess(true, 'Orders retrieved successfully', formattedOrders));
});


// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = asyncHandler(async (req, res) => {
     const orders = await Order.find().populate('userId', 'fullName email',);
     console.log('getOrders : ', orders);
     res.status(200).json(
          new handleSuccess(true,
               orders,
               "orders fetch successfully")
     );
});


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
     const { status } = req.body;
     const { orderId } = req.params;

     if (!Object.values(ORDER_STATUS_ENUM).includes(status)) {
          throw new handleError(400, 'Invalid status');
     }

     const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
     ).populate('userId', 'fullName email');

     if (!updatedOrder) {
          throw new handleError(404, `Order with ID ${orderId} not found`);
     }

     // Send status update email to user
     await sendOrderStatusUpdateEmail(updatedOrder);

     res.status(200).json(new handleSuccess(true, 'Order status updated successfully', updatedOrder));
});


// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
const deleteOrder = asyncHandler(async (req, res) => {
     const order = await Order.findByIdAndDelete(req.params.orderId);

     if (!order) {
          handleError(404, `Order with ID ${req.params.orderId} not found`);
     }



     res.status(200).json({
          success: true,
          message: `Order with ID ${req.params.orderId} deleted successfully`
     });
});

export {
     createOrder,
     getOrders,
     getOrderById,
     updateOrderStatus,
     deleteOrder,
     getUserOrders
};
