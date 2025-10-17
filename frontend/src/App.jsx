import './App.css';
import LayoutPage from './layout/LayoutPage';
import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// Pages
import HomeBanner from './page/home/HomeBanner';
import LoginPage from './page/auth/LoginPage';
import RegisterPage from './page/auth/RegisterPage';
import VerifyEmailPage from './page/auth/VerifyEmailPage';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Check token khi app load
  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode(token); // exp là timestamp (giây)
        if (Date.now() >= exp * 1000) {
          // Token hết hạn
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/account/login");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
    <LayoutPage>
      <Routes>
        <Route path='/' element={<HomeBanner />} />
        <Route path='/account/login' element={<LoginPage />} />
        <Route path='/account/register' element={<RegisterPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='*' element={<Navigate to= "/"  />} />
      </Routes>
    </LayoutPage>
  );
}

export default App;
