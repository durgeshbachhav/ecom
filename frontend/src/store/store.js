// store.js
import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slices/UserSlice.js'
import ProductSlice from './slices/ProductSlice.js'
import OrderSlice from './slices/OrderSlice.js'
import PaymentSlice from './slices/PaymentSlice.js'
import WishlistSlice from './slices/WishListSlice.js'
import ShippingSlice from './slices/ShippingSlice.js'
import ReviewSlice from './slices/ReviewSlice.js'
import CartSlice from './slices/CartSlice.js'


export const store = configureStore({
  reducer: {
    user: UserSlice,
    product: ProductSlice,
    order: OrderSlice,
    payment: PaymentSlice,
    wishlist: WishlistSlice,
    shipping: ShippingSlice,
    review: ReviewSlice,
    cart: CartSlice,
  },
});