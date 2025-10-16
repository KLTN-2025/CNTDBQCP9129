import React from "react";

const LoginPage = () => {
  return (
    <div className="w-full  flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          ĐĂNG NHẬP TÀI KHOẢN
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Bạn chưa có tài khoản?{" "}
          <span className="underline text-red-600 hover:text-red-700 cursor-pointer">
            Đăng ký tại đây
          </span>
        </p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Nhớ tài khoản + Quên mật khẩu */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="hover:underline cursor-pointer text-red-600">
              Quên mật khẩu?
            </span>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="mt-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
