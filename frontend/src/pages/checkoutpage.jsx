  import React, { useEffect, useState, useCallback } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import Layout from '../components/layout/Layout';
  import { decreaseQuantity, deleteUserCart, fetchCart, increaseQuantity, removeFromCart } from '@/store/slices/CartSlice';
  import { fetchAccountDetails, selectCurrentUser, updateUserDetails } from '@/store/slices/UserSlice';
  import { fetchProductById } from '@/store/slices/ProductSlice';
  import { verifyPayment } from '@/store/slices/PaymentSlice';
  import { createOrder } from '@/store/slices/OrderSlice';
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  import { toast } from 'sonner';


  const CheckoutPage = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);

    const [cartProducts, setCartProducts] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [newAddress, setNewAddress] = useState({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    });

    console.log('current user : ', currentUser);
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');

    const fetchCartAndProducts = useCallback(async () => {
      if (userId) {
        try {
          const cartResponse = await dispatch(fetchCart(userId)).unwrap();
          if (cartResponse.success && cartResponse.data.products.length > 0) {
            const productPromises = cartResponse.data.products.map(async (item) => {
              const productResponse = await dispatch(fetchProductById(item.product)).unwrap();
              return { ...productResponse.data, quantity: item.quantity };
            });
            const products = await Promise.all(productPromises);
            setCartProducts(products);
          }
        } catch (error) {
          console.error('Error fetching cart or products:', error);
          toast("Failed to fetch cart or products. Please try again.");
        }
      }
    }, [dispatch, userId]);

    useEffect(() => {
      fetchCartAndProducts();
      dispatch(fetchAccountDetails(userId));
    }, [dispatch, userId, fetchCartAndProducts]);

    const handleAddressChange = (e) => {
      const { name, value } = e.target;
      setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNewAddress = async () => {
      try {
        if (!currentUser) throw new Error('User not loaded');
        const updatedAddresses = [...(currentUser.addresses || []), newAddress];
        let userData = {
          fullName: currentUser.fullName,
          email: currentUser.email,
          phone: currentUser.phone,
          addresses: updatedAddresses
        }
        console.log('user data : ', userData);
        await dispatch(updateUserDetails(userData)).unwrap();
        toast("New address added successfully.");
        setNewAddress({ street: '', city: '', state: '', zip: '', country: '' });
      } catch (error) {
        console.error('Error updating user details:', error);
        toast("Failed to add new address. Please try again.");
      }
    };

    const totalPrice = cartProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);

    const handleQuantityChange = async (productId, action) => {
      try {
        const response = await dispatch(action === 'increase' ? increaseQuantity : decreaseQuantity({ productId, userId })).unwrap();
        setCartProducts(prev => prev.map(product =>
          product._id === productId ? { ...product, quantity: response.data.quantity } : product
        ));
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "Error",
          description: "Failed to update quantity. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handleRemoveProductFromCart = async (productId) => {
      try {
        await dispatch(removeFromCart({ productId, userId }));
        setCartProducts(prev => prev.filter(product => product._id !== productId));
        toast({
          title: "Success",
          description: "Product removed from cart.",
        });
      } catch (error) {
        console.error('Error removing product from cart:', error);
        toast({
          title: "Error",
          description: "Failed to remove product. Please try again.",
          variant: "destructive",
        });
      }
    };

    const handlePayment = async () => {
      if (!selectedAddress) {
        toast("Please select an address before proceeding.");
        return;
      }

      try {
        const orderData = {
          userId: currentUser._id,
          products: cartProducts.map(product => ({
            productId: product._id,
            quantity: product.quantity,
            price: product.price
          })),
          addressId: selectedAddress,
          total: totalPrice,
          currency: "INR",
          notes: {
            userId: currentUser._id,
            userName: currentUser.fullName,
            mobile: phoneNumber,
          }
        };

        console.log('order data : ',orderData);
        const orderResponse = await dispatch(createOrder(orderData)).unwrap();

        const options = {
          key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency,
          name: "Your Company Name",
          description: "Order Payment",
          order_id: orderResponse.data.id,
          handler: async function (response) {
            try {
              const paymentData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderResponse.data.amount,
                receiptId: orderResponse.data.receiptId,
                orderId: orderResponse.data.orderId
              };

              const verifyResponse = await dispatch(verifyPayment(paymentData)).unwrap();
              if (verifyResponse.success) {
                toast("Payment verified successfully!");
                dispatch(deleteUserCart(userId));
                navigate('/orders');
              } else {
                toast("Payment verification failed. Please try again.");
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              toast("An error occurred while verifying the payment. Please try again.");
            }
          },
          prefill: {
            name: currentUser.fullName,
            email: currentUser.email,
            contact: phoneNumber,
          },
          theme: {
            color: "#3399cc",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } catch (error) {
        console.error('Error creating order:', error);
        toast("An error occurred while creating the order. Please try again.");
      }
    };

    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Select Address</label>
                      <Select onValueChange={setSelectedAddress} value={selectedAddress}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an address" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentUser?.addresses?.map((address) => (
                            console.log('address : ', address.city),
                            <SelectItem key={address._id} value={address._id}>

                              {`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Add New Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['street', 'city', 'state', 'zip', 'country'].map((field) => (
                      <div key={field}>
                        <label className="block mb-2 capitalize">{field}</label>
                        <Input
                          type="text"
                          name={field}
                          value={newAddress[field]}
                          onChange={handleAddressChange}
                        />
                      </div>
                    ))}
                    <Button onClick={handleAddNewAddress} className="w-full">Add Address</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartProducts.map((product) => (
                      <div key={product._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={product.productImages[0]} alt={product.name} className="w-16 h-16 object-cover rounded mr-4" />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-500">${product.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button onClick={() => handleQuantityChange(product._id, 'decrease')} variant="outline" size="sm">-</Button>
                          <span className="mx-2">{product.quantity}</span>
                          <Button onClick={() => handleQuantityChange(product._id, 'increase')} variant="outline" size="sm">+</Button>
                          <Button onClick={() => handleRemoveProductFromCart(product._id)} variant="destructive" size="sm" className="ml-4">Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePayment} className="w-full">Proceed to Payment</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  export default CheckoutPage;