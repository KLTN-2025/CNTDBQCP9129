import React, { useState } from "react";
import { authApi } from "../../api/authApi";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || isLoading) return;
    setError("");
    setIsLoading(true);
    setNotification("");
    try {
      const res = await authApi.forgotPassword(email);
      console.log("res: ", res.data);
      setNotification(res.data.message);
    } catch (error) {
      console.log("error: ", error);
      setError(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-50 pt-10">
      {!notification ? (
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
            Quên mật khẩu
          </h1>
          <p className="text-center text-sm text-gray-500 mb-6">
            Bạn chưa có tài khoản?{" "}
            <Link to="/account/register">
              <span className="underline text-red-600 hover:text-red-700 cursor-pointer">
                Đăng ký tại đây
              </span>
            </Link>
          </p>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error ? <label className="text-red-700">{error}</label> : ""}
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
            <button
              type="submit"
              className="mt-2 bg-red-600 flex justify-center text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all cursor-pointer"
            >
              {isLoading ? (
                <img
                  className="object-cover w-7 h-7 rounded-full"
                  src="/loading.gif"
                  alt="đang tải"
                />
              ) : (
                <p>Lấy lại mật khẩu</p>
              )}
            </button>
          </form>
          <Link to="/account/login">
            <span className=" text-red-600 hover:text-red-700 cursor-pointer text-center">
              Quay lại
            </span>
          </Link>
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

export default ForgotPassword;
