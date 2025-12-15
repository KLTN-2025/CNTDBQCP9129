import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useEffect } from "react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await authApi.resetPassword(token, newPassword);
      setSuccess(res.data.message);
      setTimeout(() => navigate("/account/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    document.title = "Lấy lại mật khẩu";
  }, []);
  return (
    <div className="w-full flex flex-col items-center justify-center pt-10">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Nhập mật khẩu mới
        </h1>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all cursor-pointer"
          >
            Đặt lại mật khẩu
          </button>
        </form>

        <Link to="/account/login">
          <span className="block text-red-600 hover:text-red-700 cursor-pointer text-center mt-3">
            Quay lại đăng nhập
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
