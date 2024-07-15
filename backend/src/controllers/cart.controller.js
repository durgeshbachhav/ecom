import { Cart } from '../models/cart.model.js';
import { Product } from '../models/products.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleError } from '../utils/handleError.js';
import { handleSuccess } from '../utils/handleSuccess.js';

const getMyCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new handleError(400, 'Cart not found');
    }
    if (!cart.products || cart.products.length === 0) {
        return res.status(200).json(
            new handleSuccess(200, 'Cart is empty')
        );
    }
    return res.status(200).json(
        new handleSuccess(200, 'Fetch cart successfully', cart)
    )
})
const addToCart = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new handleError(res, 404, 'Product not found');
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        // If cart does not exist, create a new one
        cart = await Cart.create({ userId, products: [{ product: productId, quantity: 1 }] });
    } else {
        // If cart exists, check if the product is already in it
        const productInCart = cart.products.find(item => item.product.toString() === productId);

        if (productInCart) {
            // If product is in the cart, increment the quantity
            productInCart.quantity += 1;
        } else {
            // If product is not in the cart, add it with quantity 1
            cart.products.push({ product: productId, quantity: 1 });
        }
        await cart.save();
    }

    return res.status(200).json(
        new handleSuccess(200, 'Product added to cart successfully', cart)
    );
});

const increaseQuantity = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(404).json(new handleError(404, 'Cart not found'));
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
        return res.status(404).json(new handleError(404, 'Product not in cart'));
    }

    // Increase the quantity
    cart.products[productIndex].quantity += 1;
    await cart.save();

    return res.status(200).json(new handleSuccess(200, 'Product quantity increased', cart));
});

const decreaseQuantity = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(404).json(new handleError(404, 'Cart not found'));
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) {
        return res.status(404).json(new handleError(404, 'Product not in cart'));
    }

    // Decrease the quantity or remove the product if quantity is 1
    if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
    } else {
        cart.products.splice(productIndex, 1);
    }
    await cart.save();

    return res.status(200).json(new handleSuccess(200, 'Product quantity decreased', cart));
});

// remove from cart
const removeFromCart = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        throw new handleError(res, 404, 'Cart not found');
    }

    // Check if product is in the cart and remove it
    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    await cart.save();

    return res.status(200).json(
        new handleSuccess(200,
            'Product removed from cart successfully',
            cart
        )
    )
});

const deleteUserCart = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find and delete the cart for the user
    const deletedCart = await Cart.findOneAndDelete({ userId });

    if (!deletedCart) {
        throw new handleError(404, 'Cart not found');
    }

    return res.status(200).json(
        new handleSuccess(200, 'Cart deleted successfully', { deletedCart })
    );
});
export {
    getMyCart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    deleteUserCart
};
