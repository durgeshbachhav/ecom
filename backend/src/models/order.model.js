import mongoose, { Schema } from 'mongoose';

export const ORDER_STATUS_ENUM = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELED: 'Canceled',
  FAILED: 'Failed',
  ON_HOLD: 'On Hold',
  PAID: 'Paid'
};


const orderProductSchema = new mongoose.Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});


const orderSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [orderProductSchema],
  addressId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  // status: {
  //   type: String,
  //   default: 'Pending'
  // },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS_ENUM),
    default: ORDER_STATUS_ENUM.PENDING
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  isPaymentVerify: {
    type: Boolean,
    default: false
  },
  receiptId: {
    type: String
  }
});

export const Order = mongoose.model("Order", orderSchema);
