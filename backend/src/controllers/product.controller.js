import { Product } from '../models/products.model.js';
import { uploadCloudinary } from '../services/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';

// Add a new product
const addNewProduct = asyncHandler(async (req, res) => {
     const { name, description, price, stock, category } = req.body;


     // Validate required fields
     if (!name || !description || !price || !stock || !category) {
          throw new handleError(400, 'All fields are required');
     }

     // Check if files were uploaded
     if (!req.files || !req.files['productImages']) {
          throw new handleError(400, 'Product images are required');
     }

     // Extract paths of uploaded images
     const productImagesPaths = req.files['productImages'].map(file => file.path);

     // Upload images to Cloudinary (assuming uploadCloudinary is a valid function)
     const uploadedImages = await Promise.all(
          productImagesPaths.map(path => uploadCloudinary(path))
     );

     // Extract URLs from Cloudinary response
     const productImages = uploadedImages.map(image => image.url);

     // Create a new product
     const newProduct = await Product.create({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
          productImages
     });

     if (!newProduct) {
          throw new handleError(res, 400, 'Error while adding product');
     }

     return res.status(201).json(
          new handleSuccess(200, 'Product added successfully',
               newProduct)
     )
});


// Update an existing product

// Update an existing product
const updateProduct = asyncHandler(async (req, res) => {
     const { productId } = req.params;
     const { name, description, price, stock, category } = req.body;

     let productImages = [];

     // Check if files were uploaded
     if (req.files && req.files['productImages']) {
          const productImagesPaths = req.files['productImages'].map(file => file.path);

          // Upload images to Cloudinary (assuming uploadCloudinary is a valid function)
          const uploadedImages = await Promise.all(
               productImagesPaths.map(path => uploadCloudinary(path))
          );

          // Extract URLs from Cloudinary response
          productImages = uploadedImages.map(image => image.url);
     }

     // Create update object
     const updateData = { name, description, price, stock, category };
     if (productImages.length > 0) {
          updateData.productImages = productImages;
     }

     console.log('updated data : ',updateData);
     // Find the product by ID and update it
     const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          updateData,
          { new: true }
     );

     if (!updatedProduct) {
          throw new handleError(404, 'Product not found');
     }

     return res.status(200).json(
          new handleSuccess(200, 'Product updated successfully', updatedProduct)
     );
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
     const { productId } = req.params; // Adjusted to match the route parameter

     // Find the product by ID and delete it
     const deletedProduct = await Product.findByIdAndDelete(productId);
     if (!deletedProduct) {
          throw new handleError(404, 'Product not found');
     }

     return res.status(200).json(
          new handleSuccess(200, 'Product deleted successfully')
     );
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
     const products = await Product.find();


     return res.status(200).json(
          new handleSuccess(200, 'Products retrieved successfully',
               products)
     );
});

// Get a single product by ID
const getProductById = asyncHandler(async (req, res) => {
     const { productId } = req.params;
     const product = await Product.findById(productId);

     if (!product) {
          throw new handleError(res, 404, 'Product not found');
     }

     return res.status(200).json(
          new handleSuccess(200, 'Product retrieved successfully',
               product)
     );

});

export {
     addNewProduct,
     updateProduct,
     deleteProduct,
     getAllProducts,
     getProductById
};
