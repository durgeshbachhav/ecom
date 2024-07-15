import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
     name: {
          type: String,
          required: true // Ensure name is required
     },
     description: {
          type: String
     },
     products: {
          type: [{
               type: Schema.Types.ObjectId,
               ref: "Product"
          }],
          required: true // Ensure products is required
     }
}, {
     timestamps: true
});

export const Category = mongoose.model("Category", categorySchema);

