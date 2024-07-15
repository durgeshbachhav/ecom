import {
     CreditCard,
     MoreVertical,
} from "lucide-react"

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
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Separator } from "@/components/ui/separator"
import AdminLayout from "../AdminLayout";
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getOrderById, selectCurrentOrder, updateOrderStatus } from "@/store/slices/OrderSlice"
import { Link, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { fetchProductById } from "@/store/slices/ProductSlice"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ORDER_STATUS_ENUM } from "@/utils/constant"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"



const OrderDetails = () => {
     const dispatch = useDispatch();
     const { orderId } = useParams();
     const currentOrder = useSelector(selectCurrentOrder)
     const [products, setProducts] = useState([]);
     console.log('current order : ', currentOrder);

     useEffect(() => {
          dispatch(getOrderById(orderId))
     }, [dispatch, orderId])

     useEffect(() => {
          if (currentOrder && currentOrder.products) {
               Promise.all(currentOrder.products.map(product =>
                    dispatch(fetchProductById(product.productId))
               )).then(results => {
                    setProducts(results.map(result => result.payload.data));
               });
          }
     }, [currentOrder, dispatch]);

     console.log('products : ', products)
     // format currency
     const formatCurrency = (amount) => {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
     };

     // formated date
     const formattedDate = currentOrder?.orderDate ? new Date(currentOrder.orderDate).toLocaleDateString() : '';



     //update order status
     const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
     const [selectedOrderId, setSelectedOrderId] = useState(null);
     const [newStatus, setNewStatus] = useState("");
     const [loading, setLoading] = useState(false);

     const handleUpdateStatus = async () => {
          setLoading(true)
          try {
               await dispatch(updateOrderStatus({ orderId: selectedOrderId, status: newStatus })).unwrap();
               setIsUpdateStatusOpen(false);
               setLoading(false);
               toast("Order status updated successfully");
          } catch (error) {
               console.error('Error updating order status:', error);
               toast("Failed to update order status");
          }
     };
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
                         <Link to="/admin/orders">Order</Link>
                         </BreadcrumbItem>
                         <BreadcrumbSeparator />
                         <BreadcrumbItem>
                              <BreadcrumbPage>{currentOrder?._id}</BreadcrumbPage>
                         </BreadcrumbItem>
                    </BreadcrumbList>
               </Breadcrumb>
               <div className="scrollbar-hide">
                    <Card >
                         <CardHeader className="flex flex-row items-start bg-muted/50">
                              <div className="grid gap-0.5">
                                   <CardTitle className="group flex items-center gap-2 text-lg">
                                        Order Id : <Badge variant="outline">{currentOrder?._id}</Badge>

                                   </CardTitle>
                                   <CardDescription>Date : {formattedDate}</CardDescription>
                              </div>
                              <div className="ml-auto flex items-center gap-1">
                                   <Button size="sm" variant="outline" className="h-8 gap-1">
                                        {currentOrder?.status}
                                   </Button>
                                   <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Button size="icon" variant="outline" className="h-8 w-8">
                                                  <MoreVertical className="h-3.5 w-3.5" />
                                                  <span className="sr-only">More</span>
                                             </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                             <DropdownMenuItem onSelect={() => {
                                                  setSelectedOrderId(currentOrder._id);
                                                  setIsUpdateStatusOpen(true)
                                             }}>
                                                  update status

                                             </DropdownMenuItem>

                                        </DropdownMenuContent>
                                   </DropdownMenu>
                              </div>
                         </CardHeader>
                         <CardContent className="p-6 text-sm">
                              <div className="grid gap-3">
                                   <div className="font-semibold">Order Details</div>
                                   <ul className="grid gap-3">
                                        {currentOrder?.products?.map((orderProduct, index) => {
                                             const product = products[index];
                                             return (
                                                  <li key={orderProduct?._id} className="flex items-center justify-between">
                                                       <div className="flex items-center gap-2">
                                                            {product && (
                                                                 <img
                                                                      src={product.productImages[0]}
                                                                      alt={product.name}
                                                                      className="w-10 h-10 object-cover rounded"
                                                                 />
                                                            )}
                                                            <span className="text-muted-foreground">
                                                                 {product ? product.name : 'Loading...'} x <span>{orderProduct.quantity}</span>
                                                            </span>
                                                       </div>
                                                       <span>{formatCurrency(orderProduct.price * orderProduct.quantity)}</span>
                                                  </li>
                                             );
                                        })}
                                   </ul>
                                   <Separator className="my-2" />
                                   <ul className="grid gap-3">
                                        <li className="flex items-center justify-between">
                                             <span className="text-muted-foreground">Subtotal</span>
                                             <span>{formatCurrency(currentOrder?.total)}</span>
                                        </li>
                                        <li className="flex items-center justify-between font-semibold">
                                             <span className="text-muted-foreground">Total</span>
                                             <span>{formatCurrency(currentOrder?.total)}</span>
                                        </li>

                                   </ul>
                              </div>
                              <Separator className="my-4" />
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="grid gap-3">
                                        <div className="font-semibold">Shipping Information</div>
                                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                                             <span>{currentOrder?.address?.street}</span>
                                             <span>{currentOrder?.address?.city}</span>
                                             <span>{currentOrder?.address?.state}</span>
                                             <span>{currentOrder?.address?.country}</span>
                                             <span>{currentOrder?.address?.zip}</span>
                                        </address>
                                   </div>
                                   <div className="grid auto-rows-max gap-3">
                                        <div className="font-semibold">Billing Information</div>
                                        <div className="text-muted-foreground">
                                             Same as shipping address
                                        </div>
                                   </div>
                              </div>
                              <Separator className="my-4" />
                              <div className="grid gap-3">
                                   <div className="font-semibold">Customer Information</div>
                                   <dl className="grid gap-3">
                                        <div className="flex items-center justify-between">
                                             <dt className="text-muted-foreground">Customer</dt>
                                             <dd>{currentOrder?.userId?.fullName}</dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <dt className="text-muted-foreground">Email</dt>
                                             <dd>
                                                  <a href={`mailto:${currentOrder?.userId?.email}`}>{currentOrder?.userId?.email}</a>
                                             </dd>
                                        </div>
                                   </dl>
                              </div>
                              <Separator className="my-4" />
                              <div className="grid gap-3">
                                   <div className="font-semibold">Payment Information</div>
                                   <dl className="grid gap-3">
                                        <div className="flex items-center justify-between">
                                             <dt className="flex items-center gap-1 text-muted-foreground">
                                                  <CreditCard className="h-4 w-4" />
                                                  Payment Status
                                             </dt>
                                             <dd>{currentOrder?.isPaymentVerify ? 'Verified' : 'Pending'}</dd>
                                        </div>
                                        {currentOrder?.receiptId && (
                                             <div className="flex items-center justify-between">
                                                  <dt className="text-muted-foreground">Receipt ID</dt>
                                                  <dd>{currentOrder.receiptId}</dd>
                                             </div>
                                        )}
                                   </dl>
                              </div>
                         </CardContent>
                         <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                              <div className="text-xs text-muted-foreground">
                                   Order Date: <time dateTime={currentOrder?.orderDate}>{formattedDate}</time>
                              </div>
                         </CardFooter>
                    </Card>
               </div>


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
     );
};

export default OrderDetails;
