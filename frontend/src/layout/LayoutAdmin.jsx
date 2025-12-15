import { useState } from "react";
import { Menu, User, Users, FileCog, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { MdWarehouse } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import { PiNotepadBold } from "react-icons/pi";
import { CiGift } from "react-icons/ci";
import { MdOutlineMessage } from "react-icons/md";
import { TbReceipt } from "react-icons/tb";
import { FaTable } from "react-icons/fa";
import { useEffect } from "react";
export default function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const activePath = location.pathname;
  const isRootProfile = activePath === "/admin";
  useEffect(() => {
      document.title = `Trang Admin`;
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center shrink-0 space-x-4">
            <Link to="/">
              <img
                src="/logo-coffee.png"
                className="h-26 w-24 cursor-pointer"
                alt="logo"
              />
            </Link>

            <p className="text-sm text-black font-bold">DASH BOARD</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-3 mt-10  shrink-0 h-screen overflow-y-scroll pb-40">
            <li>
              <Link
                to="/admin/users"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("users")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Quản lý người dùng</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("orders")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PiNotepadBold className="w-5 h-5 mr-3" />
                <span>Quản lý đơn hàng</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/product-category"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("product-category")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PenSquare className="w-5 h-5 mr-3" />
                <span>Quản lý loại sản phẩm</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("products")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PenSquare className="w-5 h-5 mr-3" />
                <span>Quản lý sản phẩm</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reservations"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("reservations")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaTable className="w-5 h-5 mr-3" />
                <span>Quản lý đặt bàn</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/vouchers"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("vouchers")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CiGift className="w-5 h-5 mr-3" />
                <span>Quản lý voucher</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/ingredients"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("ingredients")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MdWarehouse className="w-5 h-5 mr-3" />
                <span>Quản lý kho</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/recipes"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("recipes")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MdOutlineAppRegistration className="w-5 h-5 mr-3" />
                <span>Quản lý công thức</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/import-receipts"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("import-receipts")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TbReceipt className="w-5 h-5 mr-3" />
                <span>Quản lý phiếu nhập kho</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/blog-category"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("blog-category")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileCog className="w-5 h-5 mr-3" />
                <span>Quản lý loại bài viết</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/blogs"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("blogs")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <PenSquare className="w-5 h-5 mr-3" />
                <span>Quản lý bài viết</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/contacts"
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activePath.includes("contacts")
                    ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MdOutlineMessage className="w-5 h-5 mr-3" />
                <span>Quản lý lời nhắn</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Danh sách quản lý
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-scroll p-6">
          {isRootProfile ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex">
                <h2 className="text-2xl font-semibold mb-2">
                  Chào mừng đến trang quản trị của
                </h2>
                <img
                  src="/coffee-go-contact.png"
                  className="mt-[-5px] object-cover w-[300px] h-[40px]"
                  alt="coffee go"
                />
              </div>

              <p className="text-gray-500">
                Hãy chọn một mục trong menu để bắt đầu quản lý.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
