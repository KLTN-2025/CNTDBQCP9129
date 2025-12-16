import "./App.css";
import LayoutPage from "./layout/LayoutPage";
import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { ParallaxProvider } from "react-scroll-parallax";

// Pages
import HomePage from "./page/home/HomePage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import VerifyEmailPage from "./page/auth/VerifyEmailPage";
import useAuthStore from "./store/authStore";
import ForgotPassword from "./page/auth/forgotPassword";
import ResetPassword from "./page/auth/ResetPassword";
import ErrorPage from "./error/ErrorPage";
import ProfilePage from "./page/profile/ProfilePage";
import ChangePassword from "./page/profile/ChangePassword";
import OrderHistory from "./page/profile/OrderHistory";
import LayoutAdmin from "./layout/LayoutAdmin";
import BlogDetailPage from "./page/Blog/BlogDetailPage";
import NewsPage from "./page/news/NewsPage";
import AboutMePage from "./page/about/AboutMePage";
import CheckOut from "./page/checkout/CheckOut";
import ContactPage from "./page/contact/ContactPage";
import ReservationPage from "./page/reservation/ReservationPage";
// admin page
import BlogCategory from "./page/admin/BlogCategory";
import Users from "./page/admin/Users";
import Blogs from "./page/admin/Blogs";
import ShopPage from "./page/shop/ShopPage";
import ProductCategory from "./page/admin/ProductCategory";
import Products from "./page/admin/Products";
import MenuPage from "./page/menu/MenuPage";
import Ingredients from "./page/admin/Ingredients";
import Recipes from "./page/admin/Recipes";
import Orders from "./page/admin/Orders";
import Contacts from "./page/admin/Contacts";
import ImportReceipts from "./page/admin/importReceipts";
import Reservations from "./page/admin/Reservations";
import OfflineOrderPage from "./page/offlineOrder/OfflineOrderPage";
// store
import useCartStore from "./store/cartStore";
import Vouchers from "./page/admin/Vouchers";
import PaymentResult from "./page/paymentResult/PaymentResult";
import cartApi from "./api/cartApi";
function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, user } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const location = useLocation();
  // Check token khi app load
  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode(token); // exp là timestamp (giây)
        if (Date.now() >= exp * 1000) {
          // Token hết hạn
          setCart([]);
          localStorage.removeItem("cart");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          logout();
          navigate("/account/login");
        }
      } catch {
        setCart([]);
        localStorage.removeItem("cart");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logout();
        navigate("/account/login");
      }
    }
  }, [token, navigate]);
useEffect(() => {
  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart(user.id);

      if (res?.items) {
        setCart(res.items);
        localStorage.setItem("cart", JSON.stringify(res.items));
      } else {
        setCart([]);
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.error("Chưa có cart:", error);
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  if (user?.id) {
    fetchCart();
  }
}, [user?.id]);

  // Route bảo vệ cho các trang cần token
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/account/login" replace />;
    return children;
  };
  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/profile";
  const GuestRoute = ({ children }) => {
    const { user } = useAuthStore();
    if (user) return <Navigate to={redirectTo} replace />;
    return children;
  };
  const GuestOnly = ({ children }) => {
    const { user } = useAuthStore();
    if (user) return <Navigate to="/profile" replace />;
    return children;
  };
  return (
    <ParallaxProvider>
      <LayoutPage>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          theme="dark"
        />
        <Routes>
          {/* home route */}
          <Route path="/" element={<HomePage />} />

          {/* auth route */}
          <Route path="/account">
            <Route index element={<Navigate to="/account/login" replace />} />
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
          {/* profile route */}
          <Route
            path="/profile"
            element={!user ? <Navigate to="/account/login" /> : <ProfilePage />}
          >
            <Route path="orders-history" element={<OrderHistory />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          {/* admin route */}
          <Route
            path="/admin"
            element={
              user?.role === "customer" ? (
                <Navigate to="/error" />
              ) : (
                <LayoutAdmin />
              )
            }
          >
            <Route path="users" element={<Users />} />
            <Route path="blog-category" element={<BlogCategory />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="product-category" element={<ProductCategory />} />
            <Route path="products" element={<Products />} />
            <Route path="ingredients" element={<Ingredients />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="orders" element={<Orders />} />
            <Route path="vouchers" element={<Vouchers />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="import-receipts" element={<ImportReceipts />} />
            <Route path="reservations" element={<Reservations />} />
          </Route>
          {/* blog route */}
          <Route path="/blogs">
            <Route
              path=":categorySlug/:nameBlogSlug"
              element={<BlogDetailPage />}
            />
            <Route path=":categorySlug" element={<NewsPage />} />
          </Route>
          {/* offline order route */}
          <Route path="/order/offline" element={<OfflineOrderPage />} />
          {/* about me route */}
          <Route path="contact" element={<ContactPage />} />
          {/* about me route */}
          <Route path="/about-me" element={<AboutMePage />} />
          {/* shop route */}
          <Route path="/shop" element={<ShopPage />} />
          {/* check out route */}
          <Route
            path="/checkout"
            element={
              cart?.length > 0 && user ? <CheckOut /> : <Navigate to="/menu" />
            }
          />
          {/* reservation route */}
          <Route path="/reservation" element={<ReservationPage />} />
          {/* payment result route */}
          <Route path="/payment-result" element={<PaymentResult />} />
          {/* menu route */}
          <Route path="/menu/:categorySlug?" element={<MenuPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </LayoutPage>
    </ParallaxProvider>
  );
}

export default App;
