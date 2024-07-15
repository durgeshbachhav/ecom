import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";


import {
     File,
     Home,
     LineChart,
     ListFilter,
     MoreHorizontal,
     Package,
     Package2,
     PanelLeft,
     PlusCircle,
     Search,
     Settings,
     ShoppingCart,
     Users2,
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
     DropdownMenu,
     DropdownMenuCheckboxItem,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import {
     Tabs,
     TabsContent,
     TabsList,
     TabsTrigger,
} from "@/components/ui/tabs"
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchProducts, selectAllProducts } from "@/store/slices/ProductSlice";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const AdminProductsPage = () => {

     const allproduct = useSelector(selectAllProducts);
     const dispatch = useDispatch();

     useEffect(() => {
          dispatch(fetchProducts());
     }, [dispatch]);
     console.log('all products data ', allproduct.data);
     const handleDeleteProduct = (productId) => {
          return () => {
               dispatch(deleteProduct(productId));
          };
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
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

               <main className="grid flex-1 items-start gap-4 ">
                    <Tabs defaultValue="all">
                         <div className="flex items-center">
                              <TabsList>
                                   <TabsTrigger value="all">All</TabsTrigger>
                                   <TabsTrigger value="active">Active</TabsTrigger>
                                   <TabsTrigger value="draft">Draft</TabsTrigger>
                                   <TabsTrigger value="archived" className="hidden sm:flex">
                                        Archived
                                   </TabsTrigger>
                              </TabsList>
                              <div className="ml-auto flex items-center gap-2">
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
                                             <DropdownMenuCheckboxItem checked>
                                                  Active
                                             </DropdownMenuCheckboxItem>
                                             <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                                             <DropdownMenuCheckboxItem>
                                                  Archived
                                             </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                   </DropdownMenu>
                                   <Button size="sm" variant="outline" className="h-8 gap-1">
                                        <File className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                             Export
                                        </span>
                                   </Button>
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
                         <TabsContent value="all">
                              <Card x-chunk="dashboard-06-chunk-0">
                                   <CardHeader>
                                        <CardTitle>Products</CardTitle>
                                        <CardDescription>
                                             Manage your products and view their sales performance.
                                        </CardDescription>
                                   </CardHeader>
                                   <CardContent>

                                        <Table>
                                             <TableHeader>
                                                  <TableRow>
                                                       <TableHead className="hidden w-[100px] sm:table-cell">
                                                            <span className="sr-only">img</span>
                                                       </TableHead>
                                                       <TableHead>Name</TableHead>
                                                       <TableHead>Stock</TableHead>
                                                       <TableHead className="hidden md:table-cell">
                                                            Price
                                                       </TableHead>
                                                       <TableHead className="hidden md:table-cell">
                                                            Category
                                                       </TableHead>
                                                       <TableHead className="hidden md:table-cell">
                                                            Created at
                                                       </TableHead>
                                                       <TableHead>
                                                            <span className="sr-only">Actions</span>
                                                       </TableHead>
                                                  </TableRow>
                                             </TableHeader>
                                             <TableBody>
                                                  {
                                                       allproduct?.data?.map((product, index) =>
                                                       (
                                                            <TableRow key={index}>
                                                                 <TableCell className="hidden sm:table-cell">
                                                                      <img
                                                                           alt="Product img"
                                                                           className="aspect-square rounded-md object-cover"
                                                                           height="64"
                                                                           src={product.productImages[0]}
                                                                           width="64"
                                                                      />
                                                                 </TableCell>
                                                                 <TableCell className="font-medium">
                                                                      {product.name}
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <Badge variant="outline">{product.stock}</Badge>
                                                                 </TableCell>
                                                                 <TableCell className="hidden md:table-cell">
                                                                      ₹{product.price}
                                                                 </TableCell>
                                                                 <TableCell className="hidden md:table-cell">
                                                                      {product.category}
                                                                 </TableCell>
                                                                 <TableCell className="hidden md:table-cell">
                                                                      {product.createdAt}
                                                                 </TableCell>
                                                                 <TableCell>
                                                                      <DropdownMenu>
                                                                           <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                     aria-haspopup="true"
                                                                                     size="icon"
                                                                                     variant="ghost"
                                                                                >
                                                                                     <MoreHorizontal className="h-4 w-4" />
                                                                                     <span className="sr-only">Toggle menu</span>
                                                                                </Button>
                                                                           </DropdownMenuTrigger>
                                                                           <DropdownMenuContent align="end">
                                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                                <Link to={`/admin/update-product/${product?._id}`}>
                                                                                     <DropdownMenuItem>
                                                                                          Edit
                                                                                     </DropdownMenuItem>
                                                                                </Link>
                                                                                <DropdownMenuItem onClick={handleDeleteProduct(product?._id)}>
                                                                                     Delete
                                                                                </DropdownMenuItem>
                                                                           </DropdownMenuContent>
                                                                      </DropdownMenu>
                                                                 </TableCell>
                                                            </TableRow>

                                                       ))
                                                  }
                                             </TableBody>
                                        </Table>
                                   </CardContent>
                                   <CardFooter>
                                        <div className="text-xs text-muted-foreground">
                                             Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                             products
                                        </div>
                                   </CardFooter>
                              </Card>
                         </TabsContent>
                    </Tabs>
               </main>
          </AdminLayout>
     )
};

export default AdminProductsPage;
