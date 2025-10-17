import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const handleRegister = async (e) => {
    if(!email || !password || !name) return;
  e.preventDefault();
  setError("");
  setNotification("");
  try {
    const res = await authApi.registerUser(name, email, password);
    console.log("res: ", res.data);
    setNotification(res.data.message);
  } catch (error) {
    console.log("error: ", error);
    setError(error.response?.data?.message || "Có lỗi xảy ra");
  }
};

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-50 pt-10">
      {!notification ? (
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
            ĐĂNG KÝ TÀI KHOẢN
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Bạn chưa có tài khoản?{" "}
            <Link to="/account/login">
              <span className="underline text-red-600 hover:text-red-700 cursor-pointer">
                Đăng nhập tại đây
              </span>
            </Link>
          </p>
          <p className="text-xl font-bold text-center pb-10">
            THÔNG TIN CÁ NHÂN
          </p>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error ? <label className="text-red-700">{error}</label> : ""}
            {/* Name */}
            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên của bạn"
                value={name}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <button
              type="submit"
              className="mt-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all cursor-pointer"
            >
              Đăng ký
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center max-w-md p-8">
          <img
            src="/check_email.gif"
            alt="kiểm tra email"
            className="object-cover w-40 h-40"
          />
          <p className="font-semibold">{notification}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
