import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from '../components/layout/Layout';
import { selectCurrentUser } from '@/store/slices/UserSlice';
import { getOrderById, getUserOrders, selectUserOrder } from '@/store/slices/OrderSlice';
import UserOrderDetailsModel from '@/models/UserOrderDetailsModel';
import { generateInvoice } from '@/utils/generateInvoice';



const OrderPage = () => {
  const currentUser = useSelector(selectCurrentUser);
  // console.log('current user : ', currentUser);
  const orders = useSelector(selectUserOrder);
  // console.log("order details : ", orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);


  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto my-4 max-w-6xl px-4 md:my-6"
      >
        <h2 className="text-3xl font-bold mb-2">Order Details</h2>
        <p className="text-sm text-gray-600 mb-8">
          Check the status of recent and old orders & discover more products
        </p>
        {orders?.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </motion.div>
    </Layout>
  );
};



const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  // console.log('order : ', order);

  const handleDownloadInvoice = async () => {
    try {
      const fullOrderDetails = await dispatch(getOrderById(order?._id)).unwrap();
      // console.log('full order details : ', fullOrderDetails);
      generateInvoice({ order: fullOrderDetails?.data });
    } catch (error) {
      console.error("Error fetching full order details:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order?._id}</span>
            <Badge variant={order?.status === 'Pending' ? 'secondary' : 'success'}>
              {order?.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold">Order Date</p>
              <p className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Total Amount</p>
              <p className="text-sm">₹{order?.total}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Payment Status</p>
              <p className="text-sm">{order.isPaymentVerify ? 'Verified' : 'Pending'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Receipt ID</p>
              <p className="text-sm">{order.receiptId}</p>
            </div>
          </div>
          <div className="space-y-4">
            {order?.products?.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
                <p className="font-semibold">₹{product.price * product.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex space-x-4">
            <UserOrderDetailsModel order={order} />
            <Button onClick={handleDownloadInvoice}>Download Invoice</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderPage;