import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import { useRef } from "react";
import { FaImage } from "react-icons/fa6";
import { IoIosRemoveCircle } from "react-icons/io";
const ModalCreateProductCategory = ({
  isOpenModalCreateCategory,
  setIsOpenModalCreateCategory,
  createNameCategory,
  onConfirm,
  setCreateNameCategory,
  selectedFile,
  setSelectedFile,
  handleImageChange,
  isLoading,
}) => {
  useLockBodyScroll(isOpenModalCreateCategory);
  const inputRef = useRef(null);

  const handleRemoveImage = () => {
    setSelectedFile([]);
  };
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateCategory}
      onRequestClose={() => setIsOpenModalCreateCategory(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "8rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "0.5rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "460px",
        },
      }}
    >
      <div className="overflow-hidden rounded-md w-full flex flex-col select-none">
        <div className="w-full bg-green-600 text-white py-3 px-4 relative border-b-1 border-b-gray-400">
          <p className="font-bold text-xl">Thêm danh loại sản phẩm mới</p>
        </div>
        <div className="py-8 px-4 space-y-4">
          <p>Tên loại sản phẩm *</p>
          <input
            type="text"
            value={createNameCategory}
            onChange={(e) => setCreateNameCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tên danh mục"
          />
        </div>
        <div className="mb-4 px-4 space-y-4">
          <label className="font-medium">Ảnh bài viết</label>
          <p className="text-xs">Chọn 1 ảnh minh họa loại sản phẩm</p>
          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            className="mt-1 border-1 px-2 cursor-pointer rounded-xs hidden"
          />
          <FaImage
            className="text-3xl cursor-pointer"
            onClick={() => inputRef.current.click()}
          />
          {selectedFile.length > 0 && (
            <div className="relative inline-block">
              <img
                src={selectedFile[0]}
                alt="ảnh bài viết"
                className="w-16 h-16 object-cover rounded"
              />
              <IoIosRemoveCircle
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-black text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-500 transition"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-6 px-4 w-full py-8">
          <button
            className="w-full border px-2 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateCategory(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-700 w-full text-white flex items-center justify-center rounded-md px-2 py-2 cursor-pointer"
            onClick={onConfirm}
          >
            {isLoading ? (
              <img
                className="object-cover w-7 h-7 rounded-full"
                src="/loading.gif"
                alt="đang tải"
              />
            ) : (
              <p>Thêm mới</p>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateProductCategory;
