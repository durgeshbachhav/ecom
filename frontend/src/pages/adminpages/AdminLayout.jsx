

import { Badge, Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectCurrentUser } from "@/store/slices/UserSlice";
import { ModeToggle } from "@/components/mode-toggle";


const AdminLayout = ({ children }) => {
     const currentUser = useSelector(selectCurrentUser)
     const dispatch = useDispatch();
     const handleLogout = () => {
          dispatch(logoutUser(currentUser?._id));
     };

     const location = useLocation(); // Get the current location

     // Function to check if the current path matches the given path
     const isActive = (path) => {
          return location.pathname === path;
     };
     return (
          <div className="grid h-screen w-full overflow-hidden md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
               <div className="hidden border-r bg-muted/40 md:block overflow-y-auto">
                    <div className="flex flex-col gap-2 h-full">
                         <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                              {/* <Link to={`/`} className="flex items-center gap-2 font-semibold">
                                   <Package2 className="h-6 w-6" />
                                   <span className="">Ecom</span>
                              </Link> */}
                              <Link to={`/`} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/') ? 'text-primary' : ''}`}>
                                   <Package2 className="h-6 w-6" />
                                   <span className="">Ecom</span>
                              </Link>
                              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                                   <Bell className="h-4 w-4" />
                                   <span className="sr-only">Toggle notifications</span>
                              </Button>
                         </div>
                         <div className="flex-1 overflow-y-auto">

                              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                   <Link
                                        to={`/admin/dashboard`}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/admin/dashboard') ? 'text-primary bg-muted' : ''}`}
                                   >
                                        <Home className="h-4 w-4" />
                                        Dashboard
                                   </Link>
                                   <Link
                                        to={`/admin/orders`}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/admin/orders') ? 'text-primary bg-muted' : ''}`}
                                   >
                                        <ShoppingCart className="h-4 w-4" />
                                        Orders
                                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                             6
                                        </Badge>
                                   </Link>
                                   <Link
                                        to={`/admin/products`}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/admin/products') ? 'text-primary bg-muted' : ''}`}
                                   >
                                        <Package className="h-4 w-4" />
                                        Products{" "}
                                   </Link>
                                   <Link
                                        to={`/admin/users`}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/admin/users') ? 'text-primary bg-muted' : ''}`}
                                   >
                                        <Users className="h-4 w-4" />
                                        Users
                                   </Link>
                                   {/* <Link
                                        to={`/admin/analytics`}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/admin/analytics') ? 'text-primary bg-muted' : ''}`}
                                   >
                                        <LineChart className="h-4 w-4" />
                                        Analytics
                                   </Link> */}
                              </nav>
                         </div>

                    </div>
               </div>
               <div className="flex flex-col h-screen overflow-hidden">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

                         <Sheet>
                              <SheetTrigger asChild>
                                   <Button
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 md:hidden"
                                   >
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Toggle navigation menu</span>
                                   </Button>
                              </SheetTrigger>
                              <SheetContent side="left" className="flex flex-col">
                                   <nav className="grid gap-2 text-lg font-medium">
                                        <Link
                                             to={`/`}
                                             className="flex items-center gap-2 text-lg font-semibold"
                                        >
                                             <Package2 className="h-6 w-6" />
                                             <span className="sr-only">Ecom</span>
                                        </Link>
                                        {/* wehen user select the links then add this classname bg-muted */}
                                        <Link
                                             to={`/admin/dashboard`}
                                             className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-text-foreground px-3 py-2 text-muted-foreground hover:text-foreground ${isActive('/admin/dashboard') ? 'bg-muted' : ''}`}
                                        >
                                             <Home className="h-5 w-5" />
                                             Dashboard
                                        </Link>
                                        <Link
                                             to={`/admin/orders`}
                                             className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-text-foreground px-3 py-2 text-muted-foreground hover:text-foreground ${isActive('/admin/orders') ? 'bg-muted' : ''}`}
                                        >
                                             <ShoppingCart className="h-5 w-5" />
                                             Orders
                                             <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                                  6
                                             </Badge>
                                        </Link>
                                        <Link
                                             to={`/admin/products`}

                                             className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-text-foreground px-3 py-2 text-muted-foreground hover:text-foreground ${isActive('/admin/products') ? 'bg-muted' : ''}`}
                                        >
                                             <Package className="h-5 w-5" />
                                             Products
                                        </Link>
                                        <Link
                                             to={`/admin/users`}

                                             className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-text-foreground px-3 py-2 text-muted-foreground hover:text-foreground ${isActive('/admin/users') ? 'bg-muted' : ''}`}
                                        >
                                             <Users className="h-5 w-5" />
                                             Users
                                        </Link>
                                        {/* <Link
                                             to={`/admin/analytics`}

                                             className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-text-foreground px-3 py-2 text-muted-foreground hover:text-foreground ${isActive('/admin/analytics') ? 'bg-muted' : ''}`}
                                        >
                                             <LineChart className="h-5 w-5" />
                                             Analytics
                                        </Link> */}
                                   </nav>

                              </SheetContent>
                         </Sheet>

                         <div className="w-full flex-1">
                              <form>
                                   <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                             type="search"
                                             placeholder="Search products..."
                                             className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                        />
                                   </div>
                              </form>
                         </div>
                         <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                   <Button variant="secondary" size="icon" className="rounded-full">
                                        <CircleUser className="h-5 w-5" />
                                        <span className="sr-only">Toggle user menu</span>
                                   </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                   <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                   <DropdownMenuSeparator />
                                   <Link to={`/admin/settings`}>
                                        <DropdownMenuItem>Settings</DropdownMenuItem>
                                   </Link>
                                   
                                   <DropdownMenuSeparator />
                                   <DropdownMenuItem>
                                        <Button onClick={handleLogout}>Logout</Button>
                                   </DropdownMenuItem>
                              </DropdownMenuContent>
                         </DropdownMenu>
                         <ModeToggle />
                    </header>
                    <main className="flex flex-1 flex-col overflow-y-auto gap-4 p-4 lg:gap-6 lg:p-6">
                         {
                              children
                         }
                    </main>
               </div>
          </div>
     )
};

export default AdminLayout;
