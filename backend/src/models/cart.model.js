import mongoose, { Schema } from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});



export const Cart = mongoose.model("Cart", cartSchema);
