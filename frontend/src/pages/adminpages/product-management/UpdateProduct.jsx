import AdminLayout from "../AdminLayout";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, selectCurrentProduct, updateProduct } from "@/store/slices/ProductSlice";


const UpdateProduct = () => {
     const { productId } = useParams();
     console.log('product id : ', productId);

     const editor = useRef(null);
     const [content, setContent] = useState('');
     const [name, setName] = useState("");
     const [stock, setStocks] = useState();
     const [price, setPrice] = useState();
     const [category, setCategory] = useState("");
     const [productImages, setProductImages] = useState([]);
     const [loading, setLoading] = useState(false);

     const [productImageUrl, setProductImageUrl] = useState([]);
     const dispatch = useDispatch();
     // Assuming you have a way to fetch the current product details
     const currentProduct = useSelector(selectCurrentProduct);
     useEffect(() => {
          dispatch(fetchProductById(productId))
     }, [productId, dispatch])
     console.log('current product : ', currentProduct);

     useEffect(() => {
          if (currentProduct) {
               setName(currentProduct.name);
               setContent(currentProduct.description);
               setPrice(currentProduct.price);
               setStocks(currentProduct.stock);
               setCategory(currentProduct.category);
               setProductImageUrl(currentProduct.productImages);
          }
     }, [currentProduct])


     const navigate = useNavigate();


     const handleUpdateProduct = async (e) => {
          e.preventDefault()
          setLoading(true);

          const formData = new FormData();
          formData.append('name', name);
          formData.append('description', content);
          formData.append('price', price);
          formData.append('stock', stock);
          formData.append('category', category);

          // Append each product image
          productImages.forEach((image, index) => {
               formData.append(`productImages`, image);
          });



          dispatch(updateProduct({ productId, productData: formData }))
               .then((response) => {
                    console.log('Product added successfully:', response);
                    setLoading(false);
                    toast("Product updated successfully")
                    navigate('/admin/products')
                    setName("")
                    setContent("")
                    setPrice("")
                    setCategory("")
                    setStocks("")
                    setProductImages([])
               })
               .catch((error) => {
                    console.error('Error adding product:', error);
                    setLoading(false);
                    toast("Failed to add product. Please try again.")
               });
     };



     const handleImageChange = (e) => {
          const files = Array.from(e.target.files);
          console.log('files  : ', files)
          setProductImages(files);
          const urls = files.map(file => URL.createObjectURL(file));
          console.log('urls ', urls)
          setProductImageUrl(urls);

     };

     const handleUploadIconClick = () => {
          const inputElement = document.getElementById("productImages");
          if (inputElement) {
               inputElement.click();
          }
     };
     return (
          <AdminLayout>
               <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 my-8">
                    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">

                         <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                   <Card x-chunk="dashboard-07-chunk-0">
                                        <CardHeader>
                                             <CardTitle>Update Product Details</CardTitle>
                                             <CardDescription>
                                                  please fill the details for updating the product details
                                             </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                             <div className="grid gap-6">
                                                  <div className="grid gap-3">
                                                       <Label htmlFor="name">Name</Label>
                                                       <Input
                                                            id="name"
                                                            type="text"
                                                            className="w-full"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="grid gap-3">
                                                       <Label htmlFor="price">Price</Label>
                                                       <Input
                                                            id="price"
                                                            type="number"
                                                            className="w-full"
                                                            value={price}
                                                            onChange={(e) => setPrice(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="grid gap-3">
                                                       <Label htmlFor="stocks">Stocks</Label>
                                                       <Input
                                                            id="stocks"
                                                            type="number"
                                                            className="w-full"
                                                            value={stock}
                                                            onChange={(e) => setStocks(e.target.value)}
                                                       />
                                                  </div>
                                                  <div className="grid gap-6">
                                                       <div className="grid gap-3">
                                                            <Label htmlFor="status">Category</Label>
                                                            <Select value={category} onValueChange={setCategory}>
                                                                 <SelectTrigger id="status" aria-label="Select status">
                                                                      <SelectValue placeholder="Select status" />
                                                                 </SelectTrigger>
                                                                 <SelectContent>
                                                                      <SelectItem value="draft">one</SelectItem>
                                                                      <SelectItem value="published">two</SelectItem>
                                                                      <SelectItem value="archived">three</SelectItem>
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                  </div>
                                                  <div className="grid gap-3">
                                                       <Label htmlFor="description">Description</Label>
                                                       <JoditEditor
                                                            ref={editor}
                                                            value={content}
                                                            onChange={newContent => setContent(newContent)}
                                                       />
                                                  </div>
                                             </div>
                                        </CardContent>
                                   </Card>
                              </div>
                              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                   <Card
                                        className="overflow-hidden" x-chunk="dashboard-07-chunk-4"
                                   >
                                        <CardHeader>
                                             <CardTitle>Product Images</CardTitle>
                                             <CardDescription>
                                                  maximum 5 Images 
                                             </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                             <div className="grid gap-2">
                                                  {productImageUrl.length > 0 && (
                                                       <img
                                                            alt="Product image"
                                                            className="aspect-square w-full rounded-md object-cover"
                                                            height="300"
                                                            src={productImageUrl[0]}
                                                            width="300"
                                                       />
                                                  )}
                                                  <div className="grid grid-cols-3 gap-2">
                                                       {productImageUrl.slice(1).map((url, index) => (
                                                            <button key={index}>
                                                                 <img
                                                                      alt={`Product image ${index + 2}`}
                                                                      className="aspect-square w-full rounded-md object-cover"
                                                                      height="84"
                                                                      src={url}
                                                                      width="84"
                                                                 />
                                                            </button>
                                                       ))}

                                                       <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed" onClick={handleUploadIconClick}>
                                                            <Upload className="h-4 w-4 text-muted-foreground" />
                                                            <span className="sr-only">Upload</span>
                                                       </button>

                                                  </div>
                                                  <input
                                                       id="productImages"
                                                       type="file"
                                                       multiple
                                                       onChange={handleImageChange}
                                                       className="hidden"
                                                  />

                                             </div>
                                        </CardContent>
                                   </Card>
                              </div>
                         </div>
                         <div className="flex items-center justify-center gap-2 ">
                              <Button onClick={() => navigate('/admin/products')} variant="outline" size="sm">
                                   Discard
                              </Button>
                              <Button size="sm" onClick={handleUpdateProduct} disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</Button>
                         </div>
                    </div>
               </main>
          </AdminLayout>
     )
};

export default UpdateProduct;