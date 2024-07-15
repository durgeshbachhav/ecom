import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
     NavigationMenu,
     NavigationMenuItem,
     NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
     Sheet,
     SheetContent,
     SheetTrigger,
} from "@/components/ui/sheet";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ShoppingCart, User, LayoutDashboard, Search } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectCurrentUser } from "@/store/slices/UserSlice";
import logo from '../../assets/react.svg';
import { selectCartTotalQuantity } from "@/store/slices/CartSlice";
import CartModel from "@/models/CartModel";
import { ModeToggle } from "../mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
     const currentUser = useSelector(selectCurrentUser);
     const cartTotalQuantity = useSelector(selectCartTotalQuantity);
     const [isSearchOpen, setIsSearchOpen] = useState(false);
     const dispatch = useDispatch();
     const handleLogout = () => {
          dispatch(logoutUser(currentUser?._id));
     };


     const menuItems = [
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
     ];

     const userMenuItems = [
          { name: "My Orders", href: "/orders" },
          { name: "My Wishlist", href: "/wishlist" },
          { name: "My Account", href: "/account" },

     ];

     const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

     const MotionLink = motion(Link);


     return (
          <header className="">
               <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                         <div className="flex items-center">
                              <Link to={'/'} className="mr-4">
                                   <img src={logo} alt="Logo" className="h-8" />
                              </Link>
                              <NavigationMenu className="hidden md:block">
                                   <NavigationMenuList>
                                        {menuItems.map((item) => (
                                             <NavigationMenuItem key={item.name}>
                                                  <MotionLink
                                                       to={item.href}
                                                       className="text-sm font-medium text-gray-500 transition hover:text-gray-900 mr-4"
                                                       whileHover={{ scale: 1.05 }}
                                                       whileTap={{ scale: 0.95 }}
                                                  >
                                                       {item.name}
                                                  </MotionLink>
                                             </NavigationMenuItem>
                                        ))}
                                   </NavigationMenuList>
                              </NavigationMenu>
                         </div>

                         <div className={`flex-1 mx-4 ${isSearchOpen ? 'block' : 'hidden md:block'}`}>
                              <div className="relative max-w-sm mx-auto">
                                   <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="max-w-sm mx-auto pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   />
                                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                              </div>
                         </div>

                         <div className="flex items-center">
                              <Button
                                   variant="ghost"
                                   size="icon"
                                   className="md:hidden mr-2"
                                   onClick={() => setIsSearchOpen(!isSearchOpen)}
                              >
                                   <Search className="h-5 w-5" />
                              </Button>

                              {/* {currentUser && (
                                   <Link to={`/cart/${currentUser?._id}`} className="relative mr-2">
                                        <ShoppingCart className="h-6 w-6 text-gray-500" />
                                        {cartTotalQuantity > 0 && (
                                             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                  {cartTotalQuantity}
                                             </span>
                                        )}
                                   </Link>
                              )} */}

                              {currentUser && (
                                   <CartModel>

                                        <ShoppingCart className="h-6 w-6 text-gray-500  cursor-pointer" />
                                        {cartTotalQuantity > 0 && (
                                             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                  {cartTotalQuantity}
                                             </span>
                                        )}

                                   </CartModel>
                              )}

                              {currentUser ? (
                                   <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Button variant="ghost" size="icon">
                                                  <Avatar>
                                                       <AvatarImage src={currentUser.avatar} />
                                                       <AvatarFallback>{currentUser.fullname}</AvatarFallback>
                                                  </Avatar>
                                             </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                             {userMenuItems.map((item) => (
                                                  <DropdownMenuItem key={item.name}>
                                                       <Link to={item.href}>{item.name}</Link>
                                                  </DropdownMenuItem>
                                             ))}

                                             {isAdmin && (
                                                  <DropdownMenuItem>
                                                       <Link to="/admin/dashboard">
                                                            Dashboard
                                                       </Link>
                                                  </DropdownMenuItem>
                                             )}
                                             {
                                                  currentUser &&
                                                  <Button className="w-full" onClick={handleLogout}>Logout</Button>

                                             }
                                        </DropdownMenuContent>
                                   </DropdownMenu>
                              ) : (
                                   <div className="hidden md:flex gap-2">
                                        <Button variant="default" asChild>
                                             <Link to="/login">Login</Link>
                                        </Button>
                                        <Button variant="outline" asChild>
                                             <Link to="/signup">Register</Link>
                                        </Button>
                                   </div>
                              )}
                              <ModeToggle />

                              <Sheet>
                                   <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="md:hidden ml-2">
                                             <Menu className="h-5 w-5" />
                                        </Button>
                                   </SheetTrigger>
                                   <SheetContent>
                                        <nav className="flex flex-col gap-4">
                                             {menuItems.map((item) => (
                                                  <Link
                                                       key={item.name}
                                                       to={item.href}
                                                       className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                                                  >
                                                       {item.name}
                                                  </Link>
                                             ))}
                                             {currentUser ? (
                                                  <>
                                                       {userMenuItems.map((item) => (
                                                            <Link
                                                                 key={item.name}
                                                                 to={item.href}
                                                                 className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                                                            >
                                                                 {item.name}
                                                            </Link>
                                                       ))}
                                                       {isAdmin && (
                                                            <Link
                                                                 to="/admin/dashboard"
                                                                 className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                                                            >
                                                                 Dashboard
                                                            </Link>
                                                       )}
                                                  </>
                                             ) : (
                                                  <>
                                                       <Button variant="default" asChild className="w-full">
                                                            <Link to="/login">Login</Link>
                                                       </Button>
                                                       <Button variant="outline" asChild className="w-full">
                                                            <Link to="/signup">Register</Link>
                                                       </Button>
                                                  </>
                                             )}
                                        </nav>
                                   </SheetContent>
                              </Sheet>
                         </div>
                    </div>
               </div>
          </header>
     );
};

export default Header;