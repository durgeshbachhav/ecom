// import React, { useMemo } from 'react';
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { HeartIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectCurrentUser } from '@/store/slices/UserSlice';
// import { addToCart } from '@/store/slices/CartSlice';
// import { addToWishlist } from '@/store/slices/WishListSlice';

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();
//   const currentUser = useSelector(selectCurrentUser);

//   const isInStock = useMemo(() =>
//     product?.stock > 10 ? "Available" : "Not Available",
//     [product?.stock]
//   );
//   localStorage.setItem('cart', );
//   const handleAddToCart = () => {
//     if (product?._id && currentUser?._id) {
//       localStorage.setItem('cart', //set items to localstorage);
//       )
//       dispatch(addToCart({
//         productId: product?._id,
//         userId: currentUser?._id
//       }));

//     }
//   };
//   const handleAddToWishlist = () => {
//     if (product?._id && currentUser?._id) {
//       dispatch(addToWishlist(product?._id));
//     }
//   };

//   if (!product) return null;

//   return (
//     <Card>
//       <CardContent className="p-0">
//         <img
//           src={product.productImages[0]}
//           alt={product.name}
//           className="w-full rounded-lg h-[200px] object-cover"
//         />
//         <div className="p-4">
//           <Link to={`/product/${product._id}`}>
//             <h3 className="text-lg font-semibold">{product.name}</h3>
//           </Link>
//           <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
//           <p className="text-sm text-gray-500">{isInStock}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button variant="outline" size="icon" onClick={handleAddToWishlist}>
//           <HeartIcon className="h-4 w-4" />
//         </Button>
//         <Button onClick={handleAddToCart}>Add to Cart</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ProductCard;


import React, { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/UserSlice';
import { addToCart } from '@/store/slices/CartSlice';
import { addToWishlist } from '@/store/slices/WishListSlice';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const isInStock = useMemo(() =>
    product?.stock > 10 ? "Available" : "Not Available",
    [product?.stock]
  );

  useEffect(() => {
    // Check if the product is in the cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setIsInCart(cart.some(item => item.productId === product?._id));

    // Check if the product is in the wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setIsInWishlist(wishlist.includes(product?._id));
  }, [product?._id]);

  const handleAddToCart = () => {
    if (product?._id && currentUser?._id) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = [...cart, { productId: product?._id, userId: currentUser?._id }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setIsInCart(true);
      dispatch(addToCart({
        productId: product?._id,
        userId: currentUser?._id
      }));
      toast('Product added to cart');
    }
  };

  const handleAddToWishlist = () => {
    if (product?._id && currentUser?._id) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (wishlist.includes(product?._id)) {
        toast('Product already in wishlist');
        return;
      }
      const updatedWishlist = [...wishlist, product?._id];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(true);
      dispatch(addToWishlist(product?._id));
      toast('Product added to wishlist');
    }
  };

  if (!product) return null;

  return (
    <Card>
      <CardContent className="p-0">
        <img
          src={product.productImages[0]}
          alt={product.name}
          className="w-full rounded-lg h-[200px] object-cover"
        />
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </Link>
          <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{isInStock}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddToWishlist}
          disabled={isInWishlist}
        >
          <HeartIcon className={`h-4 w-4 ${isInWishlist ? 'text-red-500' : ''}`} />
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={isInCart}
        >
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;