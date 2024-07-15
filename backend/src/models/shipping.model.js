import mongoose from "mongoose";

const { Schema } = mongoose;

const shippingSchema = new Schema(
     {
          orderId: {
               type: Schema.Types.ObjectId,
               ref: "Order",
               required: true
          },
          status: {
               type: String,
               default: "Pending"
          },
          trackingNumber: {
               type: String
          },
          estimatedDeliveryDate: {
               type: Date,
               default: () => {
                    const date = new Date();
                    date.setDate(date.getDate() + 7); // Default to next 7 days
                    return date;
               }
          }
     },
     {
          timestamps: true
     }
);

export const Shipping = mongoose.model("Shipping", shippingSchema);

