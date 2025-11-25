import { useEffect, useState } from "react";
import {  Search,  Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
// import ModalCreateBlogCategory from "../../components/modal/adminBlogCategory/ModalCreateBlogCategory";
// import ModalUpdateBlogCategory from "../../components/modal/adminBlogCategory/ModalUpdateBlogCategory";
// import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import contactApi from "../../api/contactApi";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [isOpenModalUpdateCategory, setIsOpenModalUpdateCategory] =
    useState(false);
  const [createNameCategory, setCreateNameCategory] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactApi.getAll();
        console.log(data);
        setContacts(data);
      } catch (err) {
        toast.error("Lỗi lấy lời nhắn khách hàng:", err);
      }
    };
    fetchContacts();
  }, []);
    // console.log(contacts);

  // const handleDeleteCategory = async (id) => {
  //   try {
  //     const res = await blogCategoryApi.delete(id);
  //     setCategories((prev) => prev.filter((cat) => cat._id !== id));
  //     toast.success(res.message);
  //   } catch (err) {
  //     toast.error(err.response.data.message || "Có lỗi xảy ra, vui lòng thử lại");
  //   } finally {
  //     setIsOpenConfirmDelete(false);
  //     setDeleteCategoryId(null);
  //   }
  // };
  
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý lời nhắn khách hàng
            </h2>
            <p className="text-gray-600 mt-1">
              Danh sách lời nhắn khách hàng
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm email khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ và tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nội dung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts
              .filter((contact) =>
                contact.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((contact, index) => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contact.name}
                  </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contact.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDatetimeVN(contact.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-6">
                      <button
                        // onClick={() => {
                        //   setDeleteCategoryId(category._id);
                        //   setIsOpenConfirmDelete(true);
                        // }}
                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* {isOpenConfirmDelete && (
        <ModalConfirmDelete
          content="Bạn có chắc chắn muốn xóa danh mục này?"
          isOpenConfirmDelete={isOpenConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenConfirmDelete}
          onConfirm={() => handleDeleteCategory(deleteCategoryId)}
        />
      )} */}
    </div>
  );
}
