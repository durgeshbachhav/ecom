import {
     DollarSign,
     ListFilter,
     PlusCircle,
     Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import AdminLayout from "./AdminLayout"
import { MoreHorizontal } from "lucide-react"
import {
     DropdownMenu,
     DropdownMenuCheckboxItem,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getOrders, selectUserOrder } from "@/store/slices/OrderSlice"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

//pagination component
const Pagination = ({ ordersPerPage, totalOrders, paginate, currentPage }) => {
     const pageNumbers = [];

     for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
          pageNumbers.push(i);
     }

     return (
          <nav className="flex justify-center mt-4">
               <ul className="flex space-x-2">
                    {pageNumbers.map(number => (
                         <li key={number}>
                              <Button
                                   onClick={() => paginate(number)}
                                   variant={currentPage === number ? "default" : "outline"}
                              >
                                   {number}
                              </Button>
                         </li>
                    ))}
               </ul>
          </nav>
     );
};

const AdminHome = () => {
     const orders = useSelector(selectUserOrder)
     // console.log('orders admin home : ', orders);
     const dispatch = useDispatch();
     const [currentPage, setCurrentPage] = useState(1);
     const [filterStatus, setFilterStatus] = useState("All");
     const ordersPerPage = 10;
     useEffect(() => {
          dispatch(getOrders())
     }, [dispatch])
     //sort order and slice them for current page
     const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
     const indexOfLastOrder = currentPage * ordersPerPage;
     const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
     const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

     return (
          <AdminLayout>
               <main className="flex flex-1 flex-col gap-4 ">
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                         <Card x-chunk="dashboard-01-chunk-0">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                   </CardTitle>
                                   <DollarSign className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">$45,231.89</div>
                                   <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                   </p>
                              </CardContent>
                         </Card>
                         <Card x-chunk="dashboard-01-chunk-1">
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">
                                        Users
                                   </CardTitle>
                                   <Users className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">+2350</div>
                                   <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                   </p>
                              </CardContent>
                         </Card>
                    </div>
                    <div className="grid grid-cols-1  gap-4">
                         <Card >
                              <div className="flex ">
                                   <CardHeader >
                                        <CardTitle>New Orders</CardTitle>
                                        <CardDescription className='hidden md:block'>
                                             Manage your products and view their sales performance.
                                        </CardDescription>
                                   </CardHeader>
                                   <div className="ml-auto flex flex-col md:flex-row items-center gap-2 px-4 mt-2">
                                        <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                  <Button variant="outline" size="sm" className="h-8 gap-1">
                                                       <ListFilter className="h-3.5 w-3.5" />
                                                       <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                            Filter
                                                       </span>
                                                  </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent align="end">
                                                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuCheckboxItem onClick={() => setFilterStatus("All")}>
                                                       All
                                                  </DropdownMenuCheckboxItem>
                                                  <DropdownMenuCheckboxItem onClick={() => setFilterStatus("Paid")}>
                                                       Paid
                                                  </DropdownMenuCheckboxItem>
                                                  <DropdownMenuCheckboxItem onClick={() => setFilterStatus("Pending")}>
                                                       Pending
                                                  </DropdownMenuCheckboxItem>
                                             </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Link to={`/admin/add-product`}>
                                             <Button size="sm" className="h-8 gap-1">
                                                  <PlusCircle className="h-3.5 w-3.5" />
                                                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                       Add Product
                                                  </span>
                                             </Button>
                                        </Link>
                                   </div>
                              </div>
                              <CardContent>
                                   <Table>
                                        <TableHeader>
                                             <TableRow>

                                                  <TableHead>Customer</TableHead>
                                                  <TableHead>Status</TableHead>
                                                  <TableHead className="hidden md:table-cell">Total</TableHead>
                                                  <TableHead className="hidden md:table-cell">Items</TableHead>
                                                  <TableHead className="hidden md:table-cell">Order Date</TableHead>
                                                  <TableHead>
                                                       <span className="sr-only">Actions</span>
                                                  </TableHead>
                                             </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                             {currentOrders.map((order) => (
                                                  <TableRow key={order._id}>

                                                       <TableCell className="font-medium">
                                                            {order.userId ? order.userId.fullName : 'Anonymous'}
                                                       </TableCell>
                                                       <TableCell>
                                                            <Badge variant="outline">{order.status}</Badge>
                                                       </TableCell>
                                                       <TableCell className="hidden md:table-cell">${order.total.toFixed(2)}</TableCell>
                                                       <TableCell className="hidden md:table-cell">{order.products.length}</TableCell>
                                                       <TableCell className="hidden md:table-cell">
                                                            {new Date(order.orderDate).toLocaleString()}
                                                       </TableCell>
                                                       <TableCell>
                                                            <DropdownMenu>
                                                                 <DropdownMenuTrigger asChild>
                                                                      <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                           <MoreHorizontal className="h-4 w-4" />
                                                                           <span className="sr-only">Toggle menu</span>
                                                                      </Button>
                                                                 </DropdownMenuTrigger>
                                                                 <DropdownMenuContent align="end">
                                                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                      <DropdownMenuItem>
                                                                           <Link to={`/admin/order-detail/${order?._id}`}>
                                                                                View Details</Link>
                                                                      </DropdownMenuItem>
                                                                      <DropdownMenuItem>Update Status</DropdownMenuItem>
                                                                 </DropdownMenuContent>
                                                            </DropdownMenu>
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </CardContent>
                              <CardFooter className="flex flex-col items-center">
                                   <div className="text-xs text-muted-foreground mb-4">
                                        Showing <strong>{indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)}</strong> of <strong>{orders.length}</strong> orders
                                   </div>
                                   <Pagination
                                        ordersPerPage={ordersPerPage}
                                        totalOrders={orders.length}
                                        paginate={setCurrentPage}
                                   />
                              </CardFooter>
                         </Card>
                    </div>
               </main>
          </AdminLayout>
     )
};

export default AdminHome;

