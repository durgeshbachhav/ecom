import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({
     user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
     },
     rating: {
          type: Number,
          required: true
     },
     comment: {
          type: String
     },
     productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
     }
}, {
     timestamps: true
});

export const Review = mongoose.model("Review", reviewSchema);

