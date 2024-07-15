import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true // Example: Ensure name is required
     },
     description: {
          type: String
     },
     price: {
          type: Number,
          required: true // Example: Ensure price is required
     },
     stock: {
          type: Number,
          required: true // Example: Ensure stock is required
     },
     productImages: {
          type: Array,
          required: true
     },
     category: {
          type: Array,
          required: true
     }
}, {
     timestamps: true
});

export const Product = mongoose.model("Product", productSchema);

