import { Wishlist } from '../models/wishlist.model.js';
import { Product } from '../models/products.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
     const { productId } = req.body;
     const userId = req.user._id;
     const product = await Product.findById(productId);
     if (!product) {
          throw new handleError(404, `Product with ID ${productId} not found`);
     }

     let wishlist = await Wishlist.findOne({ userId });

     if (!wishlist) {
          wishlist = await Wishlist.create({
               userId,
               products: [productId]
          });
     } else {
          if (wishlist.products.includes(productId)) {
               throw new handleError(400, 'Product already in wishlist');
          } else {
               wishlist.products.push(productId);
               await wishlist.save();
          }
     }

     res.status(201).json(
          new handleSuccess(200,
               'Product added to wishlist',
               wishlist)
     );
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
     const userId = req.user._id;

     const wishlist = await Wishlist.findOne({ userId }).populate('products', 'name description price imageUrl');
     if (!wishlist) {
          throw new handleError(404, 'Wishlist not found');
     }

     res.status(200).json(
          new handleSuccess(200,"fetch wishlist ",wishlist))
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
     const { productId } = req.params;
     const userId = req.user._id;

     const wishlist = await Wishlist.findOne({ userId });
     if (!wishlist) {
          throw new handleError(404, 'Wishlist not found');
     }

     const productIndex = wishlist.products.indexOf(productId);
     if (productIndex === -1) {
          throw new handleError(404, 'Product not found in wishlist');
     }

     wishlist.products.splice(productIndex, 1);
     await wishlist.save();

     res.status(200).json(new handleSuccess(
          200,
          'Product removed from wishlist',
          wishlist
     ));
});

// @desc    Clear user wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
     const userId = req.user._id;

     const wishlist = await Wishlist.findOne({ userId });
     if (!wishlist) {
          handleError(404, 'Wishlist not found');
     }

     wishlist.products = [];
     await wishlist.save();

     res.status(200).json({
          success: true,
          message: 'Wishlist cleared',
          data: wishlist
     });
});

export {
     addToWishlist,
     getWishlist,
     removeFromWishlist,
     clearWishlist
};
