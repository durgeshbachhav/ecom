import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectCurrentUser, updateUserDetails } from "@/store/slices/UserSlice";

const UpdateUserAccount = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');

  const dispatch = useDispatch();

  const handleUpdateUser = async () => {
    try {
      if (!currentUser) throw new Error('User not loaded');
      const updatedAddresses = [...(currentUser.addresses || []), newAddress];
      const userData = {
        ...currentUser,
        phone: phoneNumber,
        addresses: updatedAddresses
      };
      await dispatch(updateUserDetails(userData)).unwrap();
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      setNewAddress({ street: '', city: '', state: '', zip: '', country: '' });
    } catch (error) {
      console.error('Error updating user details:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog className="h-full w-full">
      <DialogTrigger asChild>
        <Button variant="secondary">Update Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Personal Details</TabsTrigger>
            <TabsTrigger value="address">New Address</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {/* Add more personal details fields here */}
            </div>
          </TabsContent>
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Add New Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {['street', 'city', 'state', 'zip', 'country'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="capitalize">{field}</Label>
                      <Input
                        id={field}
                        name={field}
                        value={newAddress[field]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-6">
          <Button onClick={handleUpdateUser}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserAccount;