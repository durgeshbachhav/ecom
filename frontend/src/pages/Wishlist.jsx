import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { fetchWishlist, removeFromWishlist } from "@/store/slices/WishListSlice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DOMPurify from 'dompurify';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.wishlist);
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);
  const handleRemoveFromWishlist = (productId) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(item => item._id !== productId);
    dispatch(removeFromWishlist(productId));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        {status === 'loading' && <p className="text-gray-500">Loading...</p>}
        {status === 'failed' && <p className="text-red-500">wishlist not found</p>}
        {status === 'succeeded' && (
          <>
            {items && items.products && items.products.length > 0 ? (
              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                          <div>
                            <div
                              className="pb-6 text-sm leading-7 text-gray-600 md:pb-7 no-underline"
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description) }}
                            />
                          </div>
                          <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="destructive"
                            onClick={() => handleRemoveFromWishlist(product._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <p className="text-gray-500">Your wishlist is empty.</p>
            )}
          </>
        )}
      </motion.div>
    </Layout>
  );
};

export default Wishlist;