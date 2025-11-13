import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import blogApi from "../../api/blogAPI";
import { AiOutlineEye } from "react-icons/ai";
import ModalPreviewBlog from "../../components/modal/blog/ModalPreviewBlog";
import ModalCreateBlog from "../../components/modal/blog/ModalCreateBlog";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import ModalUpdateBlog from "../../components/modal/blog/ModalUpdateBlog";

export default function BlogCategory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allBlogs, setAllBlogs] = useState([]);
  const [isOpenModalPreviewBlog, setIsOpenModalPreviewBlog] = useState(false);
  const [dataBlog, setDataBlog] = useState(null);
  const [isOpenModalCreateBlog, setIsOpenModalCreateBlog] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [isOpenModalUpdateBlog, setIsOpenModalUpdateBlog] = useState(false);
  const [blogToUpdate, setBlogToUpdate] = useState(null);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogApi.getAll();
        setAllBlogs(data);
      } catch (err) {
        console.error("Lỗi lấy bài viết:", err);
        toast.error(err.response.data.message)
      }
    };
    fetchBlogs();
  }, []);
  const handleRemoveBlog = async (id) => {
    try {
      await blogApi.delete(id);
      setAllBlogs((prev) => prev.filter((blog) => blog._id !== id));
      setIsOpenConfirmDelete(false);
      toast.success("Xóa bài viết thành công");
    } catch {
      toast.error("Đã xảy ra lỗi hãy thử lại");
    } finally {
      setBlogId(null);
    }
  };
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý bài viết
            </h2>
            <p className="text-gray-600 mt-1">
              Danh sách bài viết trên website
            </p>
          </div>
          <button
            onClick={() => setIsOpenModalCreateBlog(true)}
            className="flex items-center space-x-2 bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm bài viết</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên tiêu đề..."
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
                    {formatDatetimeVN(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                        onClick={() => {
                          setBlogToUpdate(blog);
                          setIsOpenModalUpdateBlog(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { 
                          setBlogId(blog._id);
                          setIsOpenConfirmDelete(true);
                        }}
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
      {isOpenModalCreateBlog && (
        <ModalCreateBlog
          isOpenModalCreateBlog={isOpenModalCreateBlog}
          setIsOpenModalCreateBlog={setIsOpenModalCreateBlog}
          setAllBlogs={setAllBlogs}
        />
      )}
      {isOpenConfirmDelete && (
        <ModalConfirmDelete
          content={"Bạn có chắc chắn muốn xóa bài viết này không"}
          isOpenConfirmDelete={isOpenConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenConfirmDelete}
          onConfirm={() => handleRemoveBlog(blogId)}
        />
      )}
      {isOpenModalUpdateBlog && (
        <ModalUpdateBlog
          isOpenModalUpdateBlog={isOpenModalUpdateBlog}
          setIsOpenModalUpdateBlog={setIsOpenModalUpdateBlog}
          blogData={blogToUpdate}
          setAllBlogs={setAllBlogs}
        />
      )}
    </div>
  );
}
