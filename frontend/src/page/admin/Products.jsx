import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";


export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý sản phẩm
            </h2>
            <p className="text-gray-600 mt-1">
              Quản lý sản phẩm trên website
            </p>
          </div>
          <button
            className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["STT", "Tên sản phẩm", "Loại sản phẩm", "Hình ảnh", "Mô tả", "Khuyến mãi", "Tình trạng", "Thao tác"].map(
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
            {/* {categories
              .filter((c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((category, index) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{category.name}</td>
                  <td className="px-6 py-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">{category.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDatetimeVN(category.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => {
                          setIsOpenModalUpdateCategory(true);
                          setCurrentCategoryId(category._id);
                          setUpdateCategoryName(category.name);
                          setSelectedFile([category.image]);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCategoryId(category._id);
                          setIsOpenConfirmDelete(true);
                        }}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
