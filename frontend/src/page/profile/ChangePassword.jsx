import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import useAuthStore from "../../store/authStore";
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Mật khẩu mới không trùng khớp!");
      return;
    }
    try {
      setIsLoading(true);
      const res = await authApi.changePassword(oldPassword, newPassword);

      if (res.message === "Đổi mật khẩu thành công!") {
        setNotification("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setError("");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
          logout();
          navigate("/account/login");
        }, 1500);
      } else {
        setError(res.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex w-full flex-col">
      <h2 className='text-xl font-bold text-center'>Đổi mật khẩu</h2>

      <form
        onSubmit={handleChangePassword}
        className="flex flex-col gap-4 pt-4 max-w-xl"
      >
        <label
          className={` ${error ? "opacity-100 text-red-700" : "opacity-100 text-green-700"} h-8`}
        >
          {error || notification}
        </label>
        {/* Mật khẩu */}
        <div className="flex gap-x-6 items-center">
          <label className="block font-medium mb-1 text-gray-700 whitespace-nowrap w-[200px]">
            Mật khẩu cũ:
          </label>
          <input
            type="password"
            value={oldPassword}
            placeholder="Nhập mật khẩu"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-x-6 items-center">
          <label className="block font-medium mb-1 text-gray-700 whitespace-nowrap  w-[200px]">
            Mật khẩu mới:
          </label>
          <input
            type="password"
            value={newPassword}
            placeholder="Nhập mật khẩu"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-x-6 items-center">
          <label className="block font-medium mb-1 text-gray-700 whitespace-nowrap w-[200px]">
            Xác nhận mật khẩu mới:
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            placeholder="Nhập mật khẩu"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-2 max-w-[180px] bg-blue-600  flex justify-center h-10 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all cursor-pointer"
        >
          {isLoading ? (
            <img
              className="object-cover w-7 h-7 rounded-full"
              src="/loading.gif"
              alt="đang tải"
            />
          ) : (
            <p>Đặt lại mật khẩu</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
