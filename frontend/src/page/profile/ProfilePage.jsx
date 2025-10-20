import { Link, Outlet, useLocation } from "react-router-dom";
import UserInfo from "../profile/UserInfo";
import useAuthStore from "../../store/authStore";
import Breadcrumbs from "../../components/Breadcrumbs";
const ProfilePage = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const isRootProfile = activePath === "/profile"; 
  const user = useAuthStore(state => state.user);
  return (
    <div className="flex min-h-screen px-20">
      <div className="w-1/4 bg-gray-100 p-4">
       <Breadcrumbs/>
      <h1 className="text-xl">TRANG TÀI KHOẢN</h1>
      <p className="text-green-700 font-bold"><span className="text-black">Xin chào, </span>{user.name}!</p>
        <ul className="space-y-3 mt-10">
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
