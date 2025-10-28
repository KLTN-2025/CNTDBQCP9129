import "./App.css";
import LayoutPage from "./layout/LayoutPage";
import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
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
import AboutMe from "./page/about/AboutMe";
// admin page
import BlogCategory from "./page/admin/BlogCategory";
import Users from "./page/admin/Users";
import Blogs from "./page/admin/Blogs";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, user } = useAuthStore();

  // Check token khi app load
  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode(token); // exp là timestamp (giây)
        if (Date.now() >= exp * 1000) {
          // Token hết hạn
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          logout();
          navigate("/account/login");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logout();
        navigate("/account/login");
      }
    }
  }, [token, navigate]);

  // Route bảo vệ cho các trang cần token
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/account/login" replace />;
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
            <Route
              path="login"
              element={user ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
              path="register"
              element={user ? <Navigate to="/" /> : <RegisterPage />}
            />
            <Route
              path="forgot-password"
              element={user ? <Navigate to="/" /> : <ForgotPassword />}
            />
            <Route
              path="reset-password"
              element={user ? <Navigate to="/" /> : <ResetPassword />}
            />
            <Route path="verify-email" element={<VerifyEmailPage />} />
          </Route>
          {/* profile route */}
          <Route
            path="/profile"
            element={!user ? <Navigate to="/account/login" /> : <ProfilePage />}
          >
            <Route path="orders" element={<OrderHistory />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          {/* admin route */}
          <Route
            path="/admin"
            element={!user ? <Navigate to="/account/login" /> : <LayoutAdmin />}
          >
            <Route path="users" element={<Users />} />
            <Route path="blog-category" element={<BlogCategory />} />
            <Route path="blogs" element={<Blogs />} />
          </Route>
          {/* blog route */}
          <Route path="/blogs">
             <Route path=":categorySlug/:nameBlogSlug" element={<BlogDetailPage/>}/>
             <Route path=":categorySlug/" element={<NewsPage/>}/>
          </Route>
          {/* about me router */}
          <Route path="/about-me" element={<AboutMe/>}/>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </LayoutPage>
    </ParallaxProvider>
  );
}

export default App;
