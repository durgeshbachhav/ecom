import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Layout from "../components/layout/Layout";
import { fetchProductById, selectCurrentProduct, selectProductError, selectProductStatus } from "@/store/slices/ProductSlice";
import { addToCart } from "@/store/slices/CartSlice";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DOMPurify from 'dompurify';
import LoadingSpinner from '@/components/skeleton/LoadingSpinner';
import ErrorComponent from '@/components/skeleton/ErrorComponent';
import { ShoppingCart, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { createReview, getReviewsByProduct, selectAllReviews } from '@/store/slices/ReviewSlice';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { selectCurrentUser } from '@/store/slices/UserSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';



const ProductDetails = () => {
  const currentUser = useSelector(selectCurrentUser)
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const productDetails = useSelector(selectCurrentProduct);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const reviews = useSelector(selectAllReviews);
  const reviewStatus = useSelector(state => state.review.status);
  const [isInCart, setIsInCart] = useState(false);
  const memoizedProductDetails = useMemo(() => productDetails, [productDetails]);
  const memoizedReviews = useMemo(() => reviews, [reviews]);
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);
  useEffect(() => {
    if (productId) {
      dispatch(getReviewsByProduct(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productDetails?.productImages?.length > 0) {
      setMainImage(productDetails.productImages[0]);
    }
  }, [productDetails]);

  const handleAddToCart = () => {
    if (productDetails?._id && currentUser?._id) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = [...cart, { productId: productDetails?._id, userId: currentUser?._id }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setIsInCart(true);
      dispatch(addToCart({
        productId: productDetails?._id,
        userId: currentUser?._id
      }));
      toast('Product added to cart');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview({ ...userReview, productId }));
    setUserReview({ rating: 0, comment: '' });
  };

  const handleRatingChange = (rating) => {
    setUserReview(prev => ({ ...prev, rating }));
  };


  if (status === 'loading') {
    return <Layout><LoadingSpinner /></Layout>;
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="pt-8 w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink><Link to="/products">Products</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{productDetails?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col justify-center items-start md:flex-row gap-4 py-12 w-full">
          <div className="w-full md:w-1/2">

            <div className="w-full flex items-center justify-center">
              <LazyLoadImage
                src={mainImage}
                alt={productDetails?.name}
                effect="blur"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <Carousel className="w-full mt-3">
              <CarouselContent className="">
                {productDetails?.productImages?.map((image, index) => (
                  <CarouselItem key={index} className="basis-2/6 ">
                    <div className="p-1">
                      <Card>
                        <AspectRatio ratio={1}>
                          <LazyLoadImage
                            src={image}
                            alt={`${productDetails.name} ${index + 1}`}
                            effect="blur"
                            className="w-full h-full object-cover rounded-md cursor-pointer"
                            onClick={() => setMainImage(image)}
                          />
                        </AspectRatio>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-14" />
              <CarouselNext className="mr-14" />
            </Carousel>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-7 border-b border-gray-300 pb-7">
              <h2 className="text-heading mb-3.5 text-lg font-bold md:text-3xl lg:text-5xl ">
                {productDetails?.name}
              </h2>
              <div className="mt-5 flex items-center">
                <div className="text-heading pr-2 text-base font-bold md:pr-0 md:text-xl lg:pr-2 lg:text-2xl 2xl:pr-0 2xl:text-4xl">
                  ${productDetails?.price}
                </div>

              </div>
              <Button className="mt-4" onClick={handleAddToCart}>Add To Cart <span className='ml-4'><ShoppingCart /></span></Button>
            </div>

            <div className="py-6">
              <ul className="space-y-5 pb-1 text-sm">

                <li>
                  <span className="text-heading inline-block pr-2 font-semibold">Category:</span>
                  <a className="hover:text-heading transition hover:underline" href="#">
                    {productDetails?.category}
                  </a>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h3 className="text-2xl font-bold mb-4">  Product Details</h3>
        <div>
          <div
            className="pb-6 text-sm leading-7 text-gray-600 md:pb-7"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productDetails?.description) }}
          />
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>

        {/* Review Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer ${star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={userReview.comment}
                  onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Write your review here..."
                />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {Array.isArray(reviews) && reviews.length > 0 ?
            (
              reviews.map((review) => (
                <Card key={review._id}>
                  <CardHeader>
                    <div className='flex items-center justify-start mb-4'>
                      <Avatar>
                        <AvatarImage src={review.user.avatar} alt="@shadcn" />
                        <AvatarFallback>{review.user.fullName}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold ml-2">{review.user.fullName}</span>
                    </div>
                    <CardTitle className="flex items-center ">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </CardTitle>
                    <div></div>
                  </CardHeader>
                  <CardContent>
                    <p>{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;