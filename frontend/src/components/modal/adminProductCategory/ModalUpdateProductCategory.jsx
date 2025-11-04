import { IoIosRemoveCircle } from "react-icons/io";
import { FaImage } from "react-icons/fa";

export default function ModalUpdateProductCategory({
  isOpenModalUpdateCategory,
  setIsOpenModalUpdateCategory,
  updateCategoryName,
  setUpdateCategoryName,
  selectedFile,
  handleImageChange,
  setSelectedFile,
  isLoading,
  onConfirm,
}) {
  if (!isOpenModalUpdateCategory) return null;

  const handleClickRemoveImage = () => setSelectedFile([]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4">Cập nhật loại sản phẩm</h2>

        {/* Nhập tên */}
        <input
          type="text"
          placeholder="Tên loại sản phẩm"
          value={updateCategoryName}
          onChange={(e) => setUpdateCategoryName(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        {/* Chọn ảnh */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="updateCategoryImage"
          />
          <label htmlFor="updateCategoryImage" className="cursor-pointer">
            <FaImage className="text-3xl text-green-600" />
          </label>

          {selectedFile[0] && (
            <div className="relative inline-block">
              <img
                src={selectedFile[0]}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
              <IoIosRemoveCircle
                onClick={handleClickRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-black text-white rounded-full hover:bg-red-500 transition"
              />
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsOpenModalUpdateCategory(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 flex justify-center cursor-pointer items-center text-white rounded hover:bg-green-700"
          >
            {isLoading ? (
              <img
                className="object-cover w-7 h-7 rounded-full"
                src="/loading.gif"
                alt="đang tải"
              />
            ) : (
              <p>Cập nhập</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
