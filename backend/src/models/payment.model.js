import mongoose, { Schema } from "mongoose";
const paymentSchema = new mongoose.Schema({
     orderId: {
          type: Schema.Types.ObjectId,
          ref: "Order",
          required: true // Ensure orderId is required
     },
     razorpay_order_id: {
          type: String,
          required: true,
     },
     razorpay_payment_id: {
          type: String,
          required: true,
     },
     razorpay_signature: {
          type: String,
          required: true,
     },
     paymentMethod: {
          type: String,
          required: true // Ensure paymentMethod is required
     },
     paymentStatus: {
          type: String,
          default: "Pending" // Default paymentStatus to "Pending"
     },

     amount: {
          type: Number,
          required: true // Ensure amount is required
     },
     paymentDate: {
          type: Date,
          default: Date.now // Use Date.now without parentheses to assign the current date
     },
     user: {
          type: Schema.Types.ObjectId,
          ref: "User"
     }
}, {
     timestamps: true
});

export const Payment = mongoose.model("Payment", paymentSchema);

