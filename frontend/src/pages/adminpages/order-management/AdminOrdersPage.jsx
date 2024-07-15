import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ListFilter,
  PlusCircle,
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
import { getOrders, selectUserOrder, updateOrderStatus } from "@/store/slices/OrderSlice"
import { Link } from "react-router-dom"
import AdminLayout from "../AdminLayout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "sonner"
import { ORDER_STATUS_ENUM } from "@/utils/constant";


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

const AdminOrdersPage = () => {
  const orders = useSelector(selectUserOrder)
  console.log('orders admin home : ', orders);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");

  const ordersPerPage = 10;

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])


  //sort order and slice them for current page

  // const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  //update order status
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);

  //filter logic

  // const [filterStatus, setFilterStatus] = useState("All");

  // Add this function to filter orders
  const filterOrders = (orders) => {
    if (filterStatus === "All") return orders;
    return orders.filter(order => order.status === filterStatus);
  };

  // Update the sorting and filtering logic
  const sortedAndFilteredOrders = filterOrders([...orders]).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedAndFilteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleUpdateStatus = async () => {
    setLoading(true)
    try {
      await dispatch(updateOrderStatus({ orderId: selectedOrder._id, status: newStatus })).unwrap();
      setIsUpdateStatusOpen(false);
      setLoading(false);
      toast("Order status updated successfully");
    } catch (error) {
      console.error('Error updating order status:', error);
      toast("Failed to update order status");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main>
        <div className="grid">
          <Card >
            <div className="flex ">
              <CardHeader >
                <CardTitle>New Orders</CardTitle>
                <CardDescription className='hidden md:block'>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <div className="ml-auto flex flex-col md:flex-row items-center gap-2 px-4 mt-2">
                {/* <DropdownMenu>
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
                </DropdownMenu> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter: {filterStatus}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "All"}
                      onCheckedChange={() => setFilterStatus("All")}
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    {Object.values(ORDER_STATUS_ENUM).map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={filterStatus === status}
                        onCheckedChange={() => setFilterStatus(status)}
                      >
                        {status}
                      </DropdownMenuCheckboxItem>
                    ))}
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
                        {order?.userId ? order?.userId?.fullName : 'Anonymous'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order?.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${order?.total ? order.total.toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{order?.products?.length}</TableCell>
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
                              <Link className="w-full" to={`/admin/order-detail/${order?._id}`}>
                                View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => {
                              setSelectedOrder(order);
                              setIsUpdateStatusOpen(true)
                            }}>
                              update status

                            </DropdownMenuItem>
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
  Showing <strong>{indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, sortedAndFilteredOrders.length)}</strong> of <strong>{sortedAndFilteredOrders.length}</strong> orders
</div>
              {/* <Pagination
                ordersPerPage={ordersPerPage}
                totalOrders={orders.length}
                paginate={setCurrentPage}
              /> */}
              <Pagination
  ordersPerPage={ordersPerPage}
  totalOrders={sortedAndFilteredOrders.length}
  paginate={setCurrentPage}
  currentPage={currentPage}
/>
            </CardFooter>
          </Card>
        </div>
      </main>



      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ORDER_STATUS_ENUM).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>{loading ? "updating..." : "update"}</Button>
          </DialogFooter> */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={loading || !newStatus}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
};

export default AdminOrdersPage;

