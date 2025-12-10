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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 pt-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex gap-8 max-lg:flex-col">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 ">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ">
              {/* Header Card */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Xin chào,</p>
                    <h2 className="text-lg font-bold">{user.name}</h2>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/profile"
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                        isRootProfile
                          ? "bg-green-50 text-green-700 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isRootProfile ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        <img
                          src="/credit-cards.png"
                          className="w-6 h-6 object-contain"
                          alt="thông tin cá nhân"
                        />
                      </div>
                      <span className="font-medium">Thông tin cá nhân</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/profile/orders-history"
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                        activePath.includes("orders")
                          ? "bg-green-50 text-green-700 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activePath.includes("orders") ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        <img
                          src="/clock.png"
                          className="w-6 h-6 object-contain"
                          alt="lịch sử đơn hàng"
                        />
                      </div>
                      <span className="font-medium">Lịch sử đơn hàng</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/profile/change-password"
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                        activePath.includes("change-password")
                          ? "bg-green-50 text-green-700 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activePath.includes("change-password") ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        <img
                          src="/reset-password.png"
                          className="w-6 h-6 object-contain"
                          alt="đổi mật khẩu"
                        />
                      </div>
                      <span className="font-medium">Đổi mật khẩu</span>
                    </Link>
                  </li>

                  {!isCustomer && (
                    <li>
                      <Link
                        to="/admin"
                        className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 text-gray-700"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <img
                            src="/coordinator.png"
                            className="w-6 h-6 object-contain"
                            alt="quản lý hệ thống"
                          />
                        </div>
                        <span className="font-medium">Quản lý hệ thống</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

              {/* Breadcrumbs at bottom */}
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <Breadcrumbs />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 lg:p-4">
              {isRootProfile ? <UserInfo user={user} /> : <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;