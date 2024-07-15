import mongoose from "mongoose";

const { Schema } = mongoose;
const wishlistSchema = new Schema({
     products: {
          type: [
               {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
               }
          ],
          required: true
     },
     userId: {
          type: Schema.Types.ObjectId,
          ref: "User"
     }
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);