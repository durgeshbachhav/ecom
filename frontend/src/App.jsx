import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import OrderPage from "./pages/OrderPage.jsx";

import { PageNotFound } from "./pages/Other/PageNotFound.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import { LoginForm } from "./pages/registration/Login.jsx";
import { SignupForm } from "./pages/registration/Signup.jsx";
import AddProduct from "./pages/adminpages/product-management/AddProduct.jsx";
import UpdateProduct from "./pages/adminpages/product-management/UpdateProduct.jsx";
import AdminHome from "./pages/adminpages/AdminHome.jsx";
import AdminProductsPage from "./pages/adminpages/AdminProductsPage.jsx";
import AdminSettings from "./pages/adminpages/AdminSettings.jsx";
import ChangeUserRole from './pages/adminpages/ChangeUserRole.jsx';
import SuperAdminCreation from './pages/adminpages/CreateSuperAdmin.jsx';
import { useEffect } from 'react';
import { selectCurrentUser, setUser } from './store/slices/UserSlice.js';
import AuthSuccess from './pages/registration/AuthSuccess.jsx';
import Wishlist from './pages/Wishlist.jsx';
import OrderDetails from './pages/adminpages/order-management/OrderDetails.jsx';
import CheckoutPage from './pages/checkoutpage.jsx';
import Account from './pages/Account.jsx';
import { Toaster } from "@/components/ui/sonner"
import AdminOrdersPage from './pages/adminpages/order-management/AdminOrdersPage.jsx';
import UsersDashboard from './pages/adminpages/User-management/UsersDashboard.jsx';

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      dispatch(setUser(parsedUser));
    }
  }, [dispatch]);



  const isAuthenticated = () => {
    return !!currentUser;
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isSuperAdmin = () => {
    return currentUser?.role === 'super_admin';
  };

  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<ProductDetails />} />

        {/* Protected routes for authenticated users */}
        {/* element={<ProtectedRoute isAllowed={isAuthenticated()} />} */}
        <Route >
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/checkout/:userId" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
        </Route>
        {/* Protected routes for admin */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated() && (isAdmin() || isSuperAdmin())} redirectPath="/" />}>
          <Route path="/admin/dashboard" element={<AdminHome />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/update-product/:productId" element={<UpdateProduct />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/change-role" element={<ChangeUserRole />} />
          <Route path="/admin/order-detail/:orderId" element={<OrderDetails />} />
          <Route path="/admin/users" element={<UsersDashboard />} />
        </Route>

        {/* Protected route for super admin */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated() && isSuperAdmin()} redirectPath="/" />}>
          <Route path="/create-super-admin" element={<SuperAdminCreation />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;

const ProtectedRoute = ({ isAllowed, redirectPath = "/login" }) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};
