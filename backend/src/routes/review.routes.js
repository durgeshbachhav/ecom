import { Router } from "express";
import { verifyJsonWebToken } from "../middleware/auth.middleware.js";
import { createReview, deleteReview, getReviewsByProduct, getReviewsByUser, updateReview } from "../controllers/review.controller.js";

const router = Router();

// Route to create a new review
router.route('').post(verifyJsonWebToken, createReview);

// Route to get all reviews for a specific product
router.route('/:productId').get(getReviewsByProduct);

// Route to get all reviews by a specific user
router.route('/:userId').get(verifyJsonWebToken, getReviewsByUser);

// Route to update a review
router.route('/:reviewId').put(verifyJsonWebToken, updateReview);

// Route to delete a review
router.route('/:reviewId').delete(verifyJsonWebToken, deleteReview);

export default router;
