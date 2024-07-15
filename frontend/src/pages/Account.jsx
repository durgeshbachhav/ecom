import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectCurrentUser } from "@/store/slices/UserSlice";
import UpdateUserAccount from "@/models/UpdateUserAccount";
import { getUserOrders, selectUserOrder } from "@/store/slices/OrderSlice";
import { Delete, Pen } from "lucide-react";

const Account = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isGoogleUser = currentUser?.authProvider === 'google';
  const hasIncompleteDetails = isGoogleUser && (!currentUser?.phone || !currentUser?.addresses?.length);
  
  const orders=useSelector(selectUserOrder)

  if (!currentUser) return null;
  const dispatch = useDispatch();
  useEffect(()=>{
     dispatch(getUserOrders())
  },[])

  return (
    <Layout>
      <div className="">
          <hr className="h-2"/>
        <ProfileSection user={currentUser} />
        <AddressBook addresses={currentUser.addresses} />
        <OrderHistory orders={orders} />
       
        {hasIncompleteDetails && <UpdateDetailsPrompt user={currentUser} />}
      </div>
    </Layout>
  );
};

const ProfileSection = ({ user }) => (
  <Card>
    <CardContent className="flex items-center space-x-4 p-6">
      <Avatar className="md:h-24 md:w-24">
        <AvatarImage src={user?.avatar} alt={user?.fullName} />
        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">{user.fullName}</h2>
        <p>Email : {user.email}</p>
        <p>Mobile Number : {user.phone ? user.phone.join(', ') : 'Not provided'}</p>
      </div>
    </CardContent>
    <CardFooter>
     <Button variant="destructive">Change Password</Button>
    </CardFooter>
  </Card>
);

const AddressBook = ({ addresses }) => (
  <Card>
    <CardHeader>
      <CardTitle>Address Book</CardTitle>
    </CardHeader>
    <CardContent>
      {addresses?.map((address, index) => (
        <div key={index} className="flex justify-between items-center mb-4">
          <p>{`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}</p>
          <div>
            <Button variant="outline" className="mr-2"><Pen /></Button>
            <Button variant="destructive"><Delete /></Button>
          </div>
        </div>
      ))}
      <UpdateUserAccount />
    </CardContent>
  </Card>
);

const OrderHistory = ({ orders }) => (
  <Card>
    <CardHeader>
      <CardTitle>Order History</CardTitle>
    </CardHeader>
    
    <CardContent>
    
      {orders?.map((order, index) => (
        <Card key={order?.receiptId} className="mb-4">
        <CardHeader>
          <CardTitle className="truncate">Order #{order?.receiptId}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Date:</strong> {new Date(order?.orderDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order?.status}</p>
          <p><strong>Total:</strong> ${order?.products?.reduce((total, product) => total + product.price, 0).toFixed(2)}</p>
          <Button variant="link">View Details</Button>
        </CardContent>
      </Card>
      ))}
    </CardContent>
  </Card>
);



const UpdateDetailsPrompt = ({ user }) => (
  <Card>
    <CardHeader>
      <CardTitle>Please complete your profile information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {!user.phone && (
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="Enter your phone number" />
        </div>
      )}
      {(!user.addresses || user.addresses.length === 0) && (
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" type="text" placeholder="Enter your address" />
        </div>
      )}
      <Button>Update Details</Button>
    </CardContent>
  </Card>
);

export default Account;