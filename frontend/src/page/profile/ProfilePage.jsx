import { Link, Outlet, useLocation } from "react-router-dom";
import UserInfo from "../profile/UserInfo";
import useAuthStore from "../../store/authStore";
import Breadcrumbs from "../../components/Breadcrumbs";
const ProfilePage = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const isRootProfile = activePath === "/profile";
  const user = useAuthStore((state) => state.user);
  const isCustomer = user.role === "customer";
  return (
    <div className="flex px-20 pt-10 gap-x-10 max-lg:px-4 mx-auto max-lg:flex-col max-lg:gap-y-10 ">
      <div className="w-1/4 max-lg:w-full shadow-xl rounded-md p-4">
        <Breadcrumbs />
        <h1 className="text-xl">TRANG TÀI KHOẢN</h1>
        <p className="text-green-700 font-bold">
          <span className="text-black">Xin chào, </span>
          {user.name}!
        </p>
        <ul className="space-y-3 mt-10">
          <li>
            <Link
              to="/profile"
              className={`block p-2 rounded ${
                isRootProfile ? "bg-green-700 text-white" : "hover:bg-gray-200"
              }`}
            >
              <div className="flex gap-x-4 items-center">
                <img
                  src="credit-cards.png"
                  className="w-8 h-8 object-cover"
                  alt="thông tin cá nhấn"
                />
                <p>Thông tin cá nhân</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/profile/orders/history"
              className={`block p-2 rounded ${
                activePath.includes("orders")
                  ? "bg-green-700 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="flex gap-x-4 items-center">
                <img
                  src="clock.png"
                  className="w-8 h-8 object-cover"
                  alt="thông tin cá nhấn"
                />
                <p>Lịch sử đơn hàng</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/profile/change-password"
              className={`block p-2 rounded ${
                activePath.includes("change-password")
                  ? "bg-green-700 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="flex gap-x-4 items-center">
                <img
                  src="reset-password.png"
                  className="w-8 h-8 object-cover"
                  alt="thông tin cá nhấn"
                />
                <p>Đổi mật khẩu</p>
                
              </div>
            </Link>
          </li>
          {!isCustomer && (
            <li>
              <Link to="/admin" className="block p-2 rounded">
                 <div className="flex gap-x-4 items-center">
                <img
                  src="coordinator.png"
                  className="w-8 h-8 object-cover"
                  alt="thông tin cá nhấn"
                />
                <p>Quản lý hệ thống</p>
              </div>
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1 pt-2 px-6 pb-6 rounded-md shadow-xl">
        {isRootProfile ? <UserInfo user={user} /> : <Outlet />}
      </div>
    </div>
  );
};

export default ProfilePage;
