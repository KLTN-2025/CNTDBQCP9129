import { useState } from "react";
import { authApi } from "../../api/authApi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import cartApi from "../../api/cartApi";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
const handleLogin = async (e) => {
  e.preventDefault();
  if (!email || !password || isLoading) return;
  
  setError("");
  setIsLoading(true); 

  try {
    const res = await authApi.loginUser(email, password);
    const resCart = await cartApi.getCart(res.user.id);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      if(!resCart.message){
       localStorage.setItem("cart", JSON.stringify(resCart));
      }
      login(res.user);
      navigate("/");
    } else {
      console.log(3);
      setError(res.message);
    }
  } catch (error) {
    console.log(error.response.data.message);
    setError(error.response.data.message);
  } finally {
    setIsLoading(false); // tắt loading
  }
};
  return (
    <div className="w-full  flex flex-col items-center justify-center pt-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          ĐĂNG NHẬP TÀI KHOẢN
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Bạn chưa có tài khoản?{" "}
          <Link to="/account/register">
            <span className="underline text-red-600 hover:text-red-700 cursor-pointer">
              Đăng ký tại đây
            </span>
          </Link>
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
         <label className={`text-red-700 ${error ? "opacity-100" : "opacity-0"} h-8`}>{error}</label>
          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <Link to='/account/forgot-password'>
              <span className="hover:underline cursor-pointer text-red-600">
                Quên mật khẩu?
              </span>
            </Link>
          </div>

          <button
            type="submit"
            className="mt-2 bg-red-600 flex justify-center text-white py-2 rounded-lg font-semibold hover:bg-red-700 h-10 transition-all cursor-pointer"
          >
             {isLoading ? (
                <img
                  className="object-cover w-7 h-7 rounded-full"
                  src="/loading.gif"
                  alt="đang tải"
                />
              ) : (
                <p>Đăng nhập</p>
              )}
            
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
