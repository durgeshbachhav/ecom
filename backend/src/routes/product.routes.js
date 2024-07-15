import { Router } from "express";
import { authorize, verifyJsonWebToken } from "../middleware/auth.middleware.js";
import { addNewProduct, updateProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Route to add a new product
router.route('/add-new-product').post(
     verifyJsonWebToken, authorize('admin', 'super_admin'), // Example middleware for JWT verification
     upload.fields([
          { name: 'productImages', maxCount: 5 }
     ]),
     addNewProduct
);

// Route to update a product
router.route('/update-product/:productId').patch(
     verifyJsonWebToken, authorize('admin', 'super_admin'), // Example middleware for JWT verification
     upload.fields([
          { name: 'productImages', maxCount: 5 }
     ]),
     updateProduct
);

// Route to delete a product
router.route('/delete-product/:productId').delete(
     verifyJsonWebToken, authorize('admin', 'super_admin'), // Example middleware for JWT verification
     deleteProduct
);

// Route to get all products
router.route('/').get(
     getAllProducts
);

// Route to get a product by ID
router.route('/:productId').get(
     getProductById
);

export default router;
