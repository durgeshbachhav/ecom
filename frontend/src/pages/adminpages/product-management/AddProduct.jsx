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
import { Badge, ChevronLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { useDispatch } from "react-redux";
import { addProduct } from "@/store/slices/ProductSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"



const AddProduct = () => {
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
  const navigate = useNavigate();



  const handleAddNewProduct = async (e) => {
    e.preventDefault()
    setLoading(true);
    if (!name || !content || !price || !stock || !category || productImages.length === 0) {
      toast("All fields including product images are required.")
      setLoading(false);
      return;
    }


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



    dispatch(addProduct(formData))
      .then((response) => {
        console.log('Product added successfully:', response);
        setLoading(false);
        toast("Product added successfully")
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
          <div className="flex items-center gap-4">
            <Link to={`/admin/products`}>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add New Product
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              In stock
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={handleAddNewProduct} disabled={loading}>
                {loading ? 'Saving...' : 'Save Product'}
              </Button>

            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Enter the details of the product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"

                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        id="price"
                        type="number"
                        className="w-full"

                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="stocks">Stocks</Label>
                      <Input
                        value={stock}
                        onChange={(e) => setStocks(e.target.value)}
                        id="stocks"
                        type="number"
                        className="w-full"

                      />
                    </div>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one">One</SelectItem>
                            <SelectItem value="two">Two</SelectItem>
                            <SelectItem value="three">Three</SelectItem>
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
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Upload Product Images Here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid  gap-2">
                    {productImageUrl.map((url, index) => (
                      <div key={index}>
                        {index === 0 ? (
                          <img
                            className="aspect-square w-full rounded-md object-cover"
                            height="300"
                            alt={`Product image ${index + 1}`}
                            src={url}
                            width="300"
                          />
                        ) : (
                          <div className="grid grid-cols-2  gap-2">
                            <button>
                              <img
                                alt={`Product image ${index + 1}`}
                                className="aspect-square w-full rounded-md object-cover"
                                height="84"
                                src={url}
                                width="84"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <div
                      className="flex py-4 w-full items-center justify-center rounded-md border border-dashed"
                      onClick={handleUploadIconClick}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        id="productImages"
                        className="hidden"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Upload</span>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm" onClick={handleAddNewProduct} disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
};

export default AddProduct;
