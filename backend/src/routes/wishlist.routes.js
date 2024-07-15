import { Router } from "express";
import { verifyJsonWebToken } from "../middleware/auth.middleware.js";
import {
     addToWishlist,
     getWishlist,
     removeFromWishlist,
     clearWishlist
} from "../controllers/wishlist.controller.js";

const router = Router();

// Route to add a product to the wishlist
router.route('').post(verifyJsonWebToken, addToWishlist);

// Route to get the user's wishlist
router.route('').get(verifyJsonWebToken, getWishlist);

// Route to remove a product from the wishlist
router.route('/:productId').delete(verifyJsonWebToken, removeFromWishlist);

// Route to clear the entire wishlist
router.route('').delete(verifyJsonWebToken, clearWishlist);

export default router;
