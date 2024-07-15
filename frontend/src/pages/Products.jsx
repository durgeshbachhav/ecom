import ProductCard from "@/components/productComponents/ProductCard.jsx";
import Layout from "../components/layout/Layout.jsx";
import { Plus, ChevronDown } from 'lucide-react'
import { useEffect, useState } from "react";
import { fetchProducts, selectAllProducts, selectProductError, selectProductStatus } from "@/store/slices/ProductSlice.js";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner.jsx";
import ErrorComponent from "@/components/skeleton/ErrorComponent.jsx";



const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(storedCart);
    setWishlist(storedWishlist);
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Layout><LoadingSpinner /></Layout>;
  }
  if (status === 'failed') {
    return <Layout><ErrorComponent error={error} /></Layout>;
  }
  console.log('products : ',products);
  return (
    <Layout>
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-2 py-10 lg:px-10">
          <div className="md:flex md:flex-row md:items-start md:justify-between">
            <h1 className="text-xl font-bold">Products</h1>
            <div className="mt-6 flex items-center  pt-2 md:mt-0 md:space-x-4  md:pt-0">
              <button
                type="button"
                className="hidden items-center rounded-md px-3 py-2 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:inline-flex"
              >
                Sort <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:hidden"
              >
                Category <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:hidden"
              >
                Color <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:hidden"
              >
                Size <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
          <hr className="my-8" />
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <div className="hidden space-y-6 divide-y lg:col-span-3 lg:block">
              <div>
                <ul className="space-y-2">
                  <li className="cursor-pointer font-medium">Sneakers</li>
                  <li className="cursor-pointer font-medium">Running Shoes</li>
                  <li className="cursor-pointer font-medium">Mens shoes</li>
                  <li className="cursor-pointer font-medium">Women shoes</li>
                  <li className="cursor-pointer font-medium">Sandals</li>
                </ul>
              </div>
              <div className="flex items-center justify-between pt-4">
                <h6 className="font-semibold">Color</h6>
                <span className="block cursor-pointer">
                  <Plus className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <h6 className="font-semibold">Size</h6>
                <span className="block  cursor-pointer">
                  <Plus className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="overflow-y-scroll max-h-screen  w-full rounded-lg  px-2 lg:col-span-9 lg:min-h-min grid gap-4 scrollbar-hide">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                  products?.map((product, i) =>
                  (
                    <ProductCard
                      product={product}
                      key={i}
                      isInCart={cart.some(item => item.productId === product._id)}
                      isInWishlist={wishlist.includes(product._id)}
                    />
                  )
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
};

export default Products;
