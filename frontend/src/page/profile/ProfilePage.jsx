import { Link, Outlet, useLocation } from "react-router-dom";
import UserInfo from "../profile/UserInfo";
const ProfilePage = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const isRootProfile = activePath === "/profile"; 

  return (
    <div className="flex min-h-screen">
      {/* Sidebar bên trái */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <ul className="space-y-3">
          <li>
            <Link
              to="/profile"
              className={`block p-2 rounded ${
                isRootProfile
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Thông tin cá nhân
            </Link>
          </li>
          <li>
            <Link
              to="/profile/orders"
              className={`block p-2 rounded ${
                activePath.includes("orders")
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Lịch sử đơn hàng
            </Link>
          </li>
          <li>
            <Link
              to="/profile/change-password"
              className={`block p-2 rounded ${
                activePath.includes("change-password")
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1 p-6">
        {isRootProfile ? <UserInfo /> : <Outlet />}
      </div>
    </div>
  );
};

export default ProfilePage;
