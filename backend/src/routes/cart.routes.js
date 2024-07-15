import { Router } from "express";
import { verifyJsonWebToken } from "../middleware/auth.middleware.js";
import { addToCart, decreaseQuantity, deleteUserCart, getMyCart, increaseQuantity, removeFromCart } from "../controllers/cart.controller.js";

const router = Router();

// Route to create a new order
router.route('/:userId').get(verifyJsonWebToken, getMyCart)
router.route('/').post(verifyJsonWebToken, addToCart);
router.route('/').delete(verifyJsonWebToken, removeFromCart)
router.route('/:userId').delete(verifyJsonWebToken, deleteUserCart)
router.route('/increase').post(verifyJsonWebToken, increaseQuantity);
router.route('/decrease').post(verifyJsonWebToken, decreaseQuantity);
export default router;
