import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/authApi";
import useAuthStore from "../../store/authStore";
import ErrorPage from "../../error/ErrorPage";
const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const login = useAuthStore(state => state.login)
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await authApi.verifyEmail(token);
        console.log(res.data.message);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        login(res.data.user);
        navigate('/')
      } catch (error) {
        console.error("Xác thực thất bại:", error);
      }
    };

    if (token) verify();
  }, [token, navigate]);

  return <ErrorPage/>
};

export default VerifyEmailPage;
