import "./App.css";
import LayoutPage from "./layout/LayoutPage";
import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
  console.log(user);
  
  return (
    <LayoutPage>
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
        <Route path="/profile"  element={!user ? <Navigate to="/account/login" /> : <ProfilePage />}>
          <Route path="orders" element={<OrderHistory/>} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </LayoutPage>
  );
}

export default App;
