import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import productCategoryApi from "../../api/productCategoryApi";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import ModalCreateProductCategory from "../../components/modal/adminProductCategory/ModalCreateProductCategory";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import usePreviewImage from "../../hooks/usePreviewImage";
import useUpAndGetLinkImage from "../../hooks/useUpAndGetLinkImage";
export default function ProductCategory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [isOpenModalCreateCategory, setIsOpenModalCreateCategory] =
    useState(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [isOpenModalUpdateCategory, setIsOpenModalUpdateCategory] =
    useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [updateCategoryName, setUpdateCategoryName] = useState("");
  const [createNameCategory, setCreateNameCategory] = useState("");
  const { selectedFile, handleImageChange, setSelectedFile } =
    usePreviewImage(1);
  const { handleImageUpload } = useUpAndGetLinkImage();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productCategoryApi.getAll();
        setCategories(data);
      } catch (err) {
        toast.error("Lỗi lấy loại sản phẩm:", err);
      }
    };
    fetchCategories();
  }, []);
  const handleCreateCategory = async () => {
    if (isLoading) {
      return toast.warning("Loại sản phẩm đang được thêm");
    }
    if (!createNameCategory.trim()) {
      toast.error("Tên loại sản phẩm không được để trống");
      return;
    }
    if (selectedFile.length === 0) {
      toast.error("Ảnh loại sản phẩm không được để trống");
      return;
    }
    try {
      setIsLoading(true);
      const image = await handleImageUpload(selectedFile);
      const newCategory = await productCategoryApi.create({
        name: createNameCategory,
        image: image[0],
      });
      if (
        newCategory &&
        newCategory._id &&
        newCategory.name &&
        newCategory.image
      ) {
        setCategories((prev) => [newCategory, ...prev]);
        toast.success("Thêm mới danh mục thành công!");
      }
      setCreateNameCategory("");
      setIsOpenModalCreateCategory(false);
      setSelectedFile([]);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateCategory = async (id, newName) => {
    try {
      await productCategoryApi.update(id, { name: newName });
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? { ...cat, name: newName } : cat))
      );
      toast.success("Cập nhật danh mục thành công!");
      setIsOpenModalUpdateCategory(false);
      setCurrentCategoryId(null);
      setUpdateCategoryName("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await productCategoryApi.delete(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      toast.success(res.message);
    } catch (err) {
      toast.error(
        err.response.data.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setIsOpenConfirmDelete(false);
      setDeleteCategoryId(null);
    }
  };
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý loại sản phẩm
            </h2>
            <p className="text-gray-600 mt-1">
              Quản lý các loại sản phẩm trên website
            </p>
          </div>
          <button
            onClick={() => setIsOpenModalCreateCategory(true)}
            className="flex items-center space-x-2 bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm loại sản phẩm</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm loại sản phẩm..."
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
                Tên loại sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
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
            {categories &&
              categories.length > 0 &&
              categories
                .filter((category) =>
                  category.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((category, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <img
                        src={category.image}
                        className="w-16 h-16 object-cover rounded-xl"
                        alt={category.name}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDatetimeVN(category.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-6">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                          onClick={() => {
                            setIsOpenModalUpdateCategory(true);
                            setCurrentCategoryId(category._id);
                            setUpdateCategoryName(category.name);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteCategoryId(category._id);
                            setIsOpenConfirmDelete(true);
                          }}
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

      {/* Modal thêm loại sản phẩm */}
      {isOpenModalCreateCategory && (
        <ModalCreateProductCategory
          isOpenModalCreateCategory={isOpenModalCreateCategory}
          setIsOpenModalCreateCategory={setIsOpenModalCreateCategory}
          setCategories={setCategories}
          onConfirm={handleCreateCategory}
          createNameCategory={createNameCategory}
          setCreateNameCategory={setCreateNameCategory}
          selectedFile={selectedFile}
          handleImageChange={handleImageChange}
          setSelectedFile={setSelectedFile}
          isLoading={isLoading}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isOpenConfirmDelete && (
        <ModalConfirmDelete
          content="Bạn có chắc chắn muốn xóa danh mục này?"
          isOpenConfirmDelete={isOpenConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenConfirmDelete}
          onConfirm={() => handleDeleteCategory(deleteCategoryId)}
        />
      )}
      {/* {isOpenModalUpdateCategory && (
        <ModalUpdateBlogCategory
          isOpenModalUpdateCategory={isOpenModalUpdateCategory}
          setIsOpenModalUpdateCategory={setIsOpenModalUpdateCategory}
          updateCategoryName={updateCategoryName}
          setUpdateCategoryName={setUpdateCategoryName}
          onConfirm={() =>
            handleUpdateCategory(currentCategoryId, updateCategoryName)
          }
        />
      )} */}
    </div>
  );
}
