import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatDateVN } from "../../utils/formatDateVN";
import blogApi from "../../api/blogAPI";
import { AiOutlineEye } from "react-icons/ai";
import ModalPreviewBlog from "../../components/modal/blog/ModalPreviewBlog";
export default function BlogCategory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allBlogs, setAllBlogs] = useState([]);
  const [isOpenModalPreviewBlog, setIsOpenModalPreviewBlog] = useState(false);
  const [dataBlog, setDataBlog] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogApi.getAll();
        console.log("data", data);

        setAllBlogs(data);
      } catch (err) {
        console.error("Lỗi lấy bài viết:", err);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý danh mục
            </h2>
            <p className="text-gray-600 mt-1">
              Quản lý các danh mục bài viết trên website
            </p>
          </div>
          <button
            // onClick={() => setIsOpenModalCreateCategory(true)}
            className="flex items-center space-x-2 bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm danh mục</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
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
                Stt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
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
            {allBlogs
              .filter((blog) =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((blog, index) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-xs">
                    {blog.categoryId.name}
                  </td>
                  <td className="px-6 py-4 text-sm  text-gray-900 truncate max-w-xs">
                    {blog.content.intro.text}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateVN(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                        // onClick={() => {
                        //   setIsOpenModalUpdateCategory(true);
                        //   setCurrentCategoryId(category._id);
                        //   setUpdateCategoryName(category.name);
                        // }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
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
                      <button
                        className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                        title="xem bài viết"
                        onClick={() => {
                          setDataBlog(blog);
                          setIsOpenModalPreviewBlog(true);
                        }}
                      >
                        <AiOutlineEye className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isOpenModalPreviewBlog && (
        <ModalPreviewBlog
          isOpenModalPreviewBlog={isOpenModalPreviewBlog}
          setIsOpenModalPreviewBlog={setIsOpenModalPreviewBlog}
          dataBlog={dataBlog}
        />
      )}
    </div>
  );
}
