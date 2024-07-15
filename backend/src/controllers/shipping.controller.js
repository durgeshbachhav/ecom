import express from 'express';
import axios from 'axios'
import 'dotenv/config';
import { Shipping } from '../models/shipping.model.js';
import { Order } from '../models/order.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';

const router = express.Router();


let authToken = null;

// Authenticate and get the token
const authenticateShiprocket = async () => {
    const response = await axios.post(`https://apiv2.shiprocket.in/v1/external/auth/login`, {
        email: "sinss.durgesh@gmail.com",
        password: "#Sinss@123",
    });

    console.log('logi  response shiprocket ', response)
    if (response.data.token) {
        authToken = response.data.token;
    } else {
        throw new handleError('Authentication with Shiprocket failed');
    }
};

// Middleware to ensure we have a valid token
const ensureAuthenticated = async (req, res, next) => {
    if (!authToken) {
        await authenticateShiprocket();
    }
    req.headers['Authorization'] = `Bearer ${authToken}`;
    next();
};

// @desc    Create a new Shipping
// @route   POST /api/deliveries
// @access  Private/Admin
const createShipping = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    // console.log('req body', orderId, status)

    const order = await Order.findById(orderId);
    if (!order) {
        throw new handleError(404, `Order with ID ${orderId} not found`, res);
    }
    // console.log('order =>', order)


    const options = {
        order_id: orderId,
        // Other Shiprocket-specific details
    };

    try {
        const shiprocketResponse = await axios.post(`https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`, options, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        console.log('shiprocket response', shiprocketResponse)


        const newShipping = await Shipping.create({
            orderId,
            status: status || 'Pending',
            trackingNumber: shiprocketResponse.data.shipment_id,
            estimatedShippingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to next 7 days
        });

        console.log('new shipping', newShipping)

        res.status(201).json(
            new handleSuccess(200, 'Shipping created successfully', newShipping)
        )

    } catch (error) {
        console.error('Error while creating Shiprocket order:', error);
        throw new handleError(500, 'Error while creating Shiprocket order', res);
    }
});



// @desc    Get Shipping details
// @route   GET /api/deliveries/:id
// @access  Private
const getShipping = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const shipping = await Shipping.findById(id).populate('orderId', 'status total orderDate');
    if (!shipping) {
        return handleError(404, 'Shipping not found', res);
    }

    res.status(200).json(
        new handleSuccess(200, shipping)
    );
});

// @desc    Update Shipping status
// @route   PUT /api/deliveries/:id
// @access  Private/Admin
const updateShippingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const shipping = await Shipping.findById(id);
    if (!shipping) {
        return handleError(404, 'Shipping not found', res);
    }

    shipping.status = status || shipping.status;
    shipping.trackingNumber = trackingNumber || shipping.trackingNumber;
    await shipping.save();

    res.status(200).json({
        success: true,
        message: 'Shipping updated successfully',
        data: shipping,
    });
});

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private/Admin
const getAllDeliveries = asyncHandler(async (req, res) => {
    const deliveries = await Shipping.find().populate('orderId', 'status total orderDate');

    res.status(200).json({
        success: true,
        data: deliveries,
    });
});

export {
    createShipping,
    getShipping,
    updateShippingStatus,
    getAllDeliveries,
};

export default router;
