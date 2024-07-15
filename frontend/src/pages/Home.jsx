// import Layout from "../components/layout/Layout.jsx";
// import ProductCard from "@/components/productComponents/ProductCard.jsx";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts, selectAllProducts, selectProductStatus } from "@/store/slices/ProductSlice.js";
// import { useEffect } from "react";

// const Home = () => {
//   const dispatch = useDispatch();
//   const products = useSelector(selectAllProducts);
//   const status = useSelector(selectProductStatus);

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchProducts());
//     }
//   }, [status, dispatch]);



//   return (
//     <Layout>
//       <div className="relative w-full  mt-12">
//         <div className="mx-auto max-w-7xl lg:px-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {products?.data?.slice(0, 4).map((product, i) => (
//               <ProductCard product={product} key={i} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   )
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import Layout from "../components/layout/Layout.jsx";
import ProductCard from "@/components/productComponents/ProductCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectAllProducts, selectProductStatus } from "@/store/slices/ProductSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }

    // Load cart and wishlist from local storage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(storedCart);
    setWishlist(storedWishlist);
  }, [status, dispatch]);

  return (
    <Layout>
      <div className="relative w-full mt-12">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products?.slice(0, 4).map((product, i) => (
              <ProductCard
                product={product}
                key={i}
                isInCart={cart.some(item => item.productId === product._id)}
                isInWishlist={wishlist.includes(product._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
};

export default Home;
