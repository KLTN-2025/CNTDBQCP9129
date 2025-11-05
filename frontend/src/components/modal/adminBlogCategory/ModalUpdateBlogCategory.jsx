import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
const ModalUpdateBlogCategory = ({
  isOpenModalUpdateCategory,
  setIsOpenModalUpdateCategory,
  updateCategoryName,
  setUpdateCategoryName,
  onConfirm,
}) => {
  useLockBodyScroll(isOpenModalUpdateCategory);
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalUpdateCategory}
      onRequestClose={() => setIsOpenModalUpdateCategory(false)}
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
        <div className="w-full py-3 px-4 relative border-b-1 border-b-gray-400">
          <p className="font-bold text-xl">Cập nhập danh mục</p>
        </div>
        <div className="py-8 px-4 space-y-4">
          <p>Tên danh mục *</p>
          <input
            type="text"
            value={updateCategoryName}
            onChange={(e) => setUpdateCategoryName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tên danh mục"
          />
        </div>
        <div className="flex items-center gap-x-6 px-4 w-full py-8">
          <button
            className="w-full border px-2 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalUpdateCategory(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-600 w-full rounded-md px-2 py-2 cursor-pointer"
            onClick={onConfirm}
            disabled={!updateCategoryName}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateBlogCategory;
