import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import userApi from "../../api/userApi";
import ModalUpdateRoleUser from "../../components/modal/adminUser/ModalUpdateRoleUser";
export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setusers] = useState([]);
  const [getUsersByRouter, setGetUsersByRouter] = useState("users");
  const [isOpenModalUpdateRoleUser, setIsOpenModalUpdateRoleUser] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  // Lấy danh sách user theo button
  useEffect(() => {
    const getAllUsersByButton = async () => {
      try {
        const res = await userApi.getAllUsers(getUsersByRouter);
        setusers(res);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi tải người dùng");
      }
    };
    getAllUsersByButton();
  }, [getUsersByRouter]);
  console.log(users);

  const handleUpdateRoleUser = async () => {
    try {
      const res = await userApi.updateUserRole(selectedUser._id, {
        role: selectedUser.role
      });
      setusers((prev) => prev.map((u) => (u._id === selectedUser._id ? res : u)));
      console.log("res", res);
      toast.success("Phân quyền thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi Phân quyền");
    } finally {
        setIsOpenModalUpdateRoleUser(false);
    }
  };
  console.log(1);
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý người dùng
            </h2>
            <p className="text-gray-600 mt-1">
              Danh sách{" "}
              {(getUsersByRouter === "users" && "người dùng") ||
                (getUsersByRouter === "users/role/manager" && "nhân viên") ||
                (getUsersByRouter === "users/role/admin" && "admin")}
            </p>
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-x-4 mt-4">
          <button
            className={`px-4 py-1 rounded-sm text-white cursor-pointer 
      ${
        getUsersByRouter === "users"
          ? "bg-green-600"
          : "bg-green-600 shadow-inner opacity-60"
      }`}
            onClick={() => setGetUsersByRouter("users")}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-1 rounded-sm text-white cursor-pointer 
      ${
        getUsersByRouter === "users/role/manager"
          ? "bg-blue-600"
          : "bg-blue-600 shadow-inner opacity-60"
      }`}
            onClick={() => setGetUsersByRouter("users/role/manager")}
          >
            Nhân viên
          </button>
          <button
            className={`px-4 py-1 rounded-sm text-white cursor-pointer 
      ${
        getUsersByRouter === "users/role/admin"
          ? "bg-orange-600"
          : "bg-orange-600 shadow-inner opacity-60"
      }`}
            onClick={() => setGetUsersByRouter("users/role/admin")}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["STT", "Tên người dùng", "Email", "Vai trò", "Phân quyền"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {users
              .filter((u) =>
                u?.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user)
                        setIsOpenModalUpdateRoleUser(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isOpenModalUpdateRoleUser && (
        <ModalUpdateRoleUser
          isOpenModalUpdateRoleUser={isOpenModalUpdateRoleUser}
          setIsOpenModalUpdateRoleUser={setIsOpenModalUpdateRoleUser}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onConfirm={handleUpdateRoleUser}
        />
      )}
    </div>
  );
}
