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
    <div className="flex px-20 pt-10 gap-x-10 mx-auto max-lg:flex-col max-lg:gap-y-10">
      <div className="w-1/4 max-lg:w-full bg-gray-200 rounded-md p-4">
       <Breadcrumbs/>
      <h1 className="text-xl">TRANG TÀI KHOẢN</h1>
      <p className="text-green-700 font-bold"><span className="text-black">Xin chào, </span>{user.name}!</p>
        <ul className="space-y-3 mt-10">
          <li>
            <Link
              to="/profile"
              className={`block p-2 rounded ${
                isRootProfile
                  ? "bg-green-700 text-white"
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
                  ? "bg-green-700 text-white"
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
                  ? "bg-green-700 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1 p-6 bg-gray-200 rounded-md">
        {isRootProfile ? <UserInfo user={user}/> : <Outlet />}
      </div>
    </div>
  );
};

export default ProfilePage;
