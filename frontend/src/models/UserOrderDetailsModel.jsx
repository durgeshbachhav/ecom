import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getOrderById, selectCurrentOrder } from '@/store/slices/OrderSlice';

const UserOrderDetailsModel = ({ order }) => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    if (order) {
      dispatch(getOrderById(order?._id))
    }
  }, [dispatch, order]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] lg:max-w-4xl max-h-96 overflow-y-scroll scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{currentOrder?._id?.slice(-6)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <Badge variant={currentOrder?.status === 'Pending' ? 'secondary' : 'success'}>
              {currentOrder?.status}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Order Date:</span>
            <span>{new Date(currentOrder?.orderDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span>₹{ currentOrder?.total ? currentOrder?.total.toFixed(2) : currentOrder?.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status:</span>
            <span>{currentOrder?.isPaymentVerify ? 'Verified' : 'Pending'}</span>
          </div>
          <div className="flex justify-between">
            <span>Receipt ID:</span>
            <span>{currentOrder?.receiptId}</span>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Customer Details:</h4>
            <p>Name: {currentOrder?.userId?.fullName}</p>
            <p>Email: {currentOrder?.userId?.email}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Shipping Address:</h4>
            <p>{currentOrder?.address?.street}</p>
            <p>{currentOrder?.address?.city}, {currentOrder?.address?.state} {currentOrder?.address?.zip}</p>
            <p>{currentOrder?.address?.country}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Product Details:</h4>
            {currentOrder?.products.map((product, index) => (
              <div key={index} className="mb-2">
                <p>Product ID: {product.productId}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ₹{product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserOrderDetailsModel;