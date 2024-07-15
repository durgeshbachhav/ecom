import { Review } from '../models/review.model.js';
import { Product } from '../models/products.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
     const { productId, rating, comment } = req.body;
     const userId = req.user._id;

     const product = await Product.findById(productId);
     if (!product) {
          handleError(404, `Product with ID ${productId} not found`);
     }

     const newReview = await Review.create({
          user: userId,
          productId,
          rating,
          comment
     });

     if (!newReview) {
          handleError(500, 'Failed to create review');
     }

     res.status(201).json({
          success: true,
          message: 'Review created successfully',
          data: newReview
     });
});

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getReviewsByProduct = asyncHandler(async (req, res) => {
     const { productId } = req.params;

     const reviews = await Review.find({ productId }).populate('user', 'fullName avatar');

     if (!reviews) {
          handleError(404, `No reviews found for product with ID ${productId}`);
     }

     res.status(200).json({
          success: true,
          data: reviews
     });
});

// @desc    Get all reviews by a user
// @route   GET /api/reviews/user/:userId
// @access  Private
const getReviewsByUser = asyncHandler(async (req, res) => {
     const { userId } = req.params;

     const reviews = await Review.find({ user: userId }).populate('productId', 'name');

     if (!reviews) {
          handleError(404, `No reviews found for user with ID ${userId}`);
     }

     res.status(200).json({
          success: true,
          data: reviews
     });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
     const { rating, comment } = req.body;
     const { reviewId } = req.params
     const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          { rating, comment },
          { new: true }
     );

     if (!updatedReview) {
          throw new handleError(404, `Review with ID ${reviewId} not found`);
     }

     res.status(200).json(
          new handleSuccess(200, 'Review updated successfully', updatedReview)
     );
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
     const { reviewId } = req.params;
     const review = await Review.findByIdAndDelete(reviewId);

     if (!review) {
          throw new handleError(404, `Review with ID ${reviewId} not found`);
     }

     res.status(200).json(
          new handleSuccess(200, 'Review deleted successfully')
     );
});

export {
     createReview,
     getReviewsByProduct,
     getReviewsByUser,
     updateReview,
     deleteReview
};
