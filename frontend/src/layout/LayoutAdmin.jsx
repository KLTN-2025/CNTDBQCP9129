import { useState, useEffect } from "react";
import { Menu, Users, FileCog, PenSquare } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MdWarehouse } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import { PiNotepadBold } from "react-icons/pi";
import { CiGift } from "react-icons/ci";
import { MdOutlineMessage } from "react-icons/md";
import { TbReceipt } from "react-icons/tb";
import { FaTable } from "react-icons/fa";
import Dashboard from "../page/admin/Dashboard";
import useAuthStore from "../store/authStore";

export default function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const activePath = location.pathname;
  const isRootAdmin = activePath === "/admin";

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    document.title = "Trang Admin";
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside
        className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        {/* Logo - Fixed */}
        <div className="flex items-center px-6 h-16 border-b border-gray-200 flex-shrink-0">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo-coffee.png"
              className="h-10 w-auto cursor-pointer"
              alt="logo"
            />
            <span className="text-sm font-bold text-black">DASH BOARD</span>
          </Link>
        </div>

        {/* Menu - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-3 mt-6 pb-6 px-3">
            {isAdmin && (
              <li>
                <Link
                  to="/admin/users"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("users")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý người dùng</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/admin/orders"
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  activePath.includes("orders")
                    ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PiNotepadBold className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Quản lý đơn hàng</span>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin/product-category"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("product-category")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <PenSquare className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý loại sản phẩm</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/admin/products"
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  activePath.includes("products")
                    ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PenSquare className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Quản lý sản phẩm</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/reservations"
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  activePath.includes("reservations")
                    ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaTable className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Quản lý đặt bàn</span>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin/vouchers"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("vouchers")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <CiGift className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý voucher</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/admin/ingredients"
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  activePath.includes("ingredients")
                    ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MdWarehouse className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Quản lý kho</span>
              </Link>
            </li>

            {isAdmin && (
              <li>
                <Link
                  to="/admin/recipes"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("recipes")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MdOutlineAppRegistration className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý công thức</span>
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/admin/import-receipts"
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  activePath.includes("import-receipts")
                    ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TbReceipt className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>Quản lý phiếu nhập kho</span>
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin/blog-category"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("blog-category")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FileCog className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý loại bài viết</span>
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                <Link
                  to="/admin/blogs"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("blogs")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <PenSquare className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý bài viết</span>
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/admin/contacts"
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    activePath.includes("contacts")
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MdOutlineMessage className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Quản lý lời nhắn</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isRootAdmin ? (
            <Dashboard/>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
