import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseQuantity, fetchCart, increaseQuantity, removeFromCart, selectCartItems, selectCartTotalQuantity } from '@/store/slices/CartSlice';
import { selectCurrentUser } from '@/store/slices/UserSlice';
import { fetchProductById } from '@/store/slices/ProductSlice';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
     Sheet,
     SheetContent,
     SheetDescription,
     SheetFooter,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const CartModel = () => {
     const dispatch = useDispatch();
     const currentUser = useSelector(selectCurrentUser);
     const userId = currentUser?._id;
     const [cartProducts, setCartProducts] = useState([]);
     const [isOpen, setIsOpen] = useState(false);
     const cartTotalQuantity = useSelector(selectCartTotalQuantity);
     const navigate = useNavigate();
     const cartItems = useSelector(selectCartItems)
     console.log('cart items : ',cartItems);

     const fetchCartAndProducts = useCallback(async () => {
          if (userId) {
               try {
                    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
                    const productPromises = cartItems.map(async (item) => {
                         const productResponse = await dispatch(fetchProductById(item.product)).unwrap();
                         return { ...productResponse.data, quantity: item.quantity || 1 }; // Fallback to 1 if quantity is not set
                    });
                    const products = await Promise.all(productPromises);
                    setCartProducts(products);
                    dispatch(fetchCart(userId)); // Update Redux store
               } catch (error) {
                    console.error('Error fetching cart or products:', error);
               }
          }
     }, [dispatch, userId ]);

     useEffect(() => {
          if (isOpen) {
               fetchCartAndProducts();
          }
     }, [fetchCartAndProducts, isOpen]);

     const totalPrice = cartProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);

     const updateLocalStorage = (updatedCart) => {
          localStorage.setItem('cart', JSON.stringify(updatedCart));
     };

     const handleRemoveProductFromCart = async (productId) => {
          const updatedCart = cartProducts.filter(product => product._id !== productId);
          setCartProducts(updatedCart);
          updateLocalStorage(updatedCart.map(product => ({ productId: product._id, quantity: product.quantity })));
          dispatch(removeFromCart({ productId, userId }));
          toast('Product removed from cart');
     };

     const handleIncreaseQuantity = async (productId) => {
          const updatedCart = cartProducts.map(product =>
               product._id === productId ? { ...product, quantity: product.quantity + 1 } : product
          );
          setCartProducts(updatedCart);
          updateLocalStorage(updatedCart.map(product => ({ productId: product._id, quantity: product.quantity })));
          dispatch(increaseQuantity({ productId, userId }));
     };

     const handleDecreaseQuantity = async (productId) => {
          const updatedCart = cartProducts.map(product =>
               product._id === productId && product.quantity > 1
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
          );
          setCartProducts(updatedCart);
          updateLocalStorage(updatedCart.map(product => ({ productId: product._id, quantity: product.quantity })));
          dispatch(decreaseQuantity({ productId, userId }));
     };

     const handleProceedToCheckout = () => {
          navigate(`/checkout/${currentUser?._id}`);
          setIsOpen(false);
     };

     return (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <div className='px-2 md:px-4'>
                    <SheetTrigger asChild className=''>
                         <div className='relative cursor-pointer '>
                              <ShoppingCart className=" text-gray-500" />
                              {cartTotalQuantity > 0 && (
                                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartTotalQuantity}
                                   </span>
                              )}
                         </div>
                    </SheetTrigger>
               </div>
               <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                         <SheetTitle>Your Cart</SheetTitle>
                         <SheetDescription>
                              Review your items before checkout
                         </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 py-4">
                         {cartProducts.length > 0 ? cartProducts.map((product) => (
                              <Card key={product._id}>
                                   <CardContent className="flex items-center justify-between p-4">
                                        <div className='flex items-start justify-between flex-col gap-4'>
                                             {product.productImages && product.productImages.length > 0 ? (
                                                  <LazyLoadImage
                                                       src={product.productImages[0]}
                                                       alt={product.name}
                                                       width={50}
                                                       height={50}
                                                       className="rounded-lg mr-4"
                                                  />
                                             ) : (
                                                  <div className="w-[50px] h-[50px] bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                                                       No Image
                                                  </div>
                                             )}
                                             <div className="flex-grow">
                                                  <h3 className="text-sm font-semibold">{product.name}</h3>
                                                  <p className="text-xs text-gray-600">${product.price}</p>
                                             </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-center">


                                             <div className="flex items-center gap-2">
                                                  <Button onClick={() => handleDecreaseQuantity(product._id)} variant="outline">-</Button>
                                                  <Button variant="outline">{product.quantity || 0}</Button>
                                                  <Button onClick={() => handleIncreaseQuantity(product._id)} variant="outline">+</Button>
                                             </div>


                                             <Button onClick={() => handleRemoveProductFromCart(product._id)} variant="destructive" size="sm" className="">
                                                  <Trash2 />
                                             </Button>
                                        </div>
                                   </CardContent>
                              </Card>
                         )) : (
                              <p>Your cart is empty.</p>
                         )}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between font-semibold mb-4">
                         <span>Total</span>
                         <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <SheetFooter>
                         <Button onClick={handleProceedToCheckout} className="w-full">
                              Proceed to Checkout
                         </Button>
                    </SheetFooter>
               </SheetContent>
          </Sheet>
     );
};

export default CartModel;