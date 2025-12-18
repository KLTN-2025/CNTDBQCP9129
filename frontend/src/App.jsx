import "./App.css";
import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { ParallaxProvider } from "react-scroll-parallax";

import LayoutPage from "./layout/LayoutPage";
import LayoutAdmin from "./layout/LayoutAdmin";

import useAuthStore from "./store/authStore";
import useCartStore from "./store/cartStore";
import cartApi from "./api/cartApi";

// Pages
import HomePage from "./page/home/HomePage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import VerifyEmailPage from "./page/auth/VerifyEmailPage";
import ForgotPassword from "./page/auth/forgotPassword";
import ResetPassword from "./page/auth/ResetPassword";
import ProfilePage from "./page/profile/ProfilePage";
import ChangePassword from "./page/profile/ChangePassword";
import OrderHistory from "./page/profile/OrderHistory";
import BlogDetailPage from "./page/Blog/BlogDetailPage";
import NewsPage from "./page/news/NewsPage";
import AboutMePage from "./page/about/AboutMePage";
import ContactPage from "./page/contact/ContactPage";
import ReservationPage from "./page/reservation/ReservationPage";
import ShopPage from "./page/shop/ShopPage";
import MenuPage from "./page/menu/MenuPage";
import CheckOut from "./page/checkout/CheckOut";
import OfflineOrderPage from "./page/offlineOrder/OfflineOrderPage";
import PaymentResult from "./page/paymentResult/PaymentResult";
import ErrorPage from "./error/ErrorPage";

// Admin pages
import Users from "./page/admin/Users";
import BlogCategory from "./page/admin/BlogCategory";
import Blogs from "./page/admin/Blogs";
import ProductCategory from "./page/admin/ProductCategory";
import Products from "./page/admin/Products";
import Ingredients from "./page/admin/Ingredients";
import Recipes from "./page/admin/Recipes";
import Orders from "./page/admin/Orders";
import Vouchers from "./page/admin/Vouchers";
import Contacts from "./page/admin/Contacts";
import ImportReceipts from "./page/admin/importReceipts";
import Reservations from "./page/admin/Reservations";
import Dashboard from "./page/admin/Dashboard";
function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const { user, logout } = useAuthStore();
  const { cart, setCart } = useCartStore();

  /*TOKEN CHECK */
  useEffect(() => {
    if (!token) return;

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        logout();
        setCart([]);
        localStorage.clear();
        navigate("/account/login");
      }
    } catch {
      logout();
      setCart([]);
      localStorage.clear();
      navigate("/account/login");
    }
  }, [token]);

  /* CART */
  useEffect(() => {
    if (!user?.id) return;

    const fetchCart = async () => {
      try {
        const res = await cartApi.getCart(user.id);
        setCart(res?.items || []);
        res?.items
          ? localStorage.setItem("cart", JSON.stringify(res.items))
          : localStorage.removeItem("cart");
      } catch {
        setCart([]);
        localStorage.removeItem("cart");
      }
    };

    fetchCart();
  }, [user?.id]);

  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/profile";

  const GuestRoute = ({ children }) =>
    user ? <Navigate to={redirectTo} replace /> : children;

  const GuestOnly = ({ children }) =>
    user ? <Navigate to="/profile" replace /> : children;

  // Admin + Staff
  const AdminGuard = ({ children }) => {
    if (!user) return <Navigate to="/account/login" replace />;
    if (user.role === "customer") return <Navigate to="/error" replace />;
    return children;
  };

  // Admin ONLY
  const AdminOnlyGuard = ({ children }) => {
    if (!user) return <Navigate to="/account/login" replace />;
    if (user.role !== "admin") return <Navigate to="/error" replace />;
    return children;
  };

  /* RENDER */
  return (
    <ParallaxProvider>
      <LayoutPage>
        <ToastContainer theme="dark" autoClose={2000} />

        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* AUTH */}
          <Route path="/account">
            <Route index element={<Navigate to="login" replace />} />
            <Route
              path="login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="forgot-password"
              element={
                <GuestOnly>
                  <ForgotPassword />
                </GuestOnly>
              }
            />
            <Route
              path="reset-password"
              element={
                <GuestOnly>
                  <ResetPassword />
                </GuestOnly>
              }
            />
            <Route
              path="verify-email"
              element={
                <GuestOnly>
                  <VerifyEmailPage />
                </GuestOnly>
              }
            />
          </Route>

          {/* PROFILE */}
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/account/login" />}
          >
            <Route path="orders-history" element={<OrderHistory />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <LayoutAdmin />
              </AdminGuard>
            }
          >
            <Route
              path="users"
              element={
                <AdminOnlyGuard>
                  <Users />
                </AdminOnlyGuard>
              }
            />
            <Route path="blog-category" element={<BlogCategory />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="product-category" element={<ProductCategory />} />
            <Route path="products" element={<Products />} />
            <Route path="ingredients" element={<Ingredients />} />
            <Route
              path="recipes"
              element={
                <AdminOnlyGuard>
                  <Recipes />
                </AdminOnlyGuard>
              }
            />
            <Route path="orders" element={<Orders />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route
              path="contacts"
              element={
                <AdminOnlyGuard>
                  <Contacts />
                </AdminOnlyGuard>
              }
            />
            <Route
              path="dashboard"
              element={
                <AdminOnlyGuard>
                  <Dashboard />
                </AdminOnlyGuard>
              }
            />
            <Route path="import-receipts" element={<ImportReceipts />} />
            <Route path="reservations" element={<Reservations />} />
          </Route>

          <Route
            path="/blogs/:categorySlug/:nameBlogSlug"
            element={<BlogDetailPage />}
          />
          <Route path="/blogs/:categorySlug" element={<NewsPage />} />
          <Route
            path="/order/offline"
            element={
              <AdminGuard>
                <OfflineOrderPage />
              </AdminGuard>
            }
          />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/menu/:categorySlug?" element={<MenuPage />} />
          <Route
            path="/checkout"
            element={
              cart?.length && user ? <CheckOut /> : <Navigate to="/menu" />
            }
          />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about-me" element={<AboutMePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </LayoutPage>
    </ParallaxProvider>
  );
}

export default App;
