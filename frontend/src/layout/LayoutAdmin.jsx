import React, { useState } from "react";
import { Menu, User, Users, FileCog, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { MdWarehouse } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import { PiNotepadBold } from "react-icons/pi";
export default function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const activePath = location.pathname;
  const isRootProfile = activePath === "/admin";
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        {/* Logo */}
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
        <ul className="space-y-3 mt-10 whitespace-nowrap shrink-0">
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
                activePath.includes("recipes")
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
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6 text-gray-700"/>
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
              <h2 className="text-2xl font-semibold mb-2">
                Chào mừng đến trang quản trị của COFFEE <span className="text-green-700 font-bold">GO</span>
              </h2>
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
