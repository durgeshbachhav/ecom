import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { changeUserRole, selectCurrentUser } from "@/store/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


const AdminSettings = () => {
     const [email, setEmail] = useState("");
     const [activeTab, setActiveTab] = useState("myAccount");
     const dispatch = useDispatch();
     const currentUser = useSelector(selectCurrentUser);
     console.log('current user : ', currentUser);

     const handleCreateNewAdmin = () => {
          dispatch(changeUserRole({ email, newRole: "admin" }));
          setEmail("");
     };

     const renderContent = () => {
          switch (activeTab) {
               case "myAccount":
                    return (
                         <Card>
                              <CardHeader>
                                   <CardTitle>My Account</CardTitle>
                                   <Avatar>
                                        <AvatarImage src={currentUser.avatar} />
                                        <AvatarFallback>DB</AvatarFallback>
                                   </Avatar>

                              </CardHeader>

                              <CardContent>
                                   <p>Name : {currentUser.fullName}</p>
                                   <p>Email : {currentUser.email}</p>
                                   <p>Role : {currentUser.role}</p>
                              </CardContent>
                         </Card>
                    );
               case "createNewAdmin":
                    return (
                         <Card>
                              <CardHeader>
                                   <CardTitle>Create New Admin</CardTitle>
                                   <CardDescription>Add a new admin user</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <Input
                                        placeholder="Enter user email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                   />
                              </CardContent>
                              <CardFooter>
                                   <Button onClick={handleCreateNewAdmin}>Create New Admin</Button>
                              </CardFooter>
                         </Card>
                    );
               default:
                    return null;
          }
     };

     return (
          <AdminLayout>
               <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    <div className="mx-auto grid w-full max-w-6xl gap-2">
                         <h1 className="text-3xl font-semibold">Settings</h1>
                    </div>
                    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                         <nav className="grid gap-4 text-sm text-muted-foreground">
                              <Link
                                   className={`font-semibold ${activeTab === "myAccount" ? "text-primary" : ""
                                        }`}
                                   onClick={() => setActiveTab("myAccount")}
                              >
                                   My Account
                              </Link>
                              <Link
                                   className={`font-semibold ${activeTab === "createNewAdmin" ? "text-primary" : ""
                                        }`}
                                   onClick={() => setActiveTab("createNewAdmin")}
                              >
                                   Create New Admin
                              </Link>
                         </nav>
                         <div>{renderContent()}</div>
                    </div>
               </main>
          </AdminLayout>
     );
};

export default AdminSettings;