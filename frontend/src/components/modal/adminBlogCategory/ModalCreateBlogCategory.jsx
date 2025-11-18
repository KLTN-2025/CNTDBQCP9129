import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
const ModalCreateBlogCategory = ({
  isOpenModalCreateCategory,
  setIsOpenModalCreateCategory,
  createNameCategory,
  onConfirm,
  setCreateNameCategory,
}) => {
  useLockBodyScroll(isOpenModalCreateCategory);

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
          <p className="font-bold text-xl">Thêm danh mục mới</p>
        </div>
        <div className="py-8 px-4 space-y-4">
          <p>Tên danh mục *</p>
          <input
            type="text"
            value={createNameCategory}
            onChange={(e) => setCreateNameCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tên danh mục"
          />
        </div>
        <div className="flex items-center gap-x-6 px-4 w-full py-8">
          <button
            className="w-full border px-2 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateCategory(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-700 w-full text-white rounded-md px-2 py-2 cursor-pointer"
            onClick={onConfirm}
          >
            Thêm mới
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateBlogCategory;
