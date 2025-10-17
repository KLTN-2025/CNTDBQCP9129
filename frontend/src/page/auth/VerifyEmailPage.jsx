import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/authApi";
import useAuthStore from "../../store/authStore";
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
        localStorage.setItem("verified", "true");
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

  return <div className="w-full flex flex-col items-center pt-10">
    <img src="/error.gif" alt="hỏng" className="w-50 h-40 object-cover" />
    <p className="text-center">Liên kết này đã bị hỏng. <Link to='/'><span className="text-red-600">Quay lại trang chủ</span></Link></p>
  </div>;
};

export default VerifyEmailPage;
