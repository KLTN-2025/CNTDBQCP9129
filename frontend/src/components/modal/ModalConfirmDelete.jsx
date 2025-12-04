import React from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

const ModalConfirmDelete = ({
  content,
  isOpenConfirmDelete,
  setIsOpenConfirmDelete,
  onConfirm, 
}) => {
  useLockBodyScroll(isOpenConfirmDelete);
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenConfirmDelete}
      onRequestClose={() => setIsOpenConfirmDelete(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "1rem",
          overflow: "visible",
          width: "90%",
          maxWidth: "420px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <div className="overflow-hidden rounded-2xl w-full flex flex-col items-center select-none bg-white">
        {/* Icon cảnh báo */}
        <div className="w-full pt-8 pb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Nội dung thông báo */}
        <div className="w-full px-6 pb-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
          <p className="text-gray-600 text-sm">{content}</p>
        </div>

        {/* Các nút hành động */}
        <div className="w-full flex border-t border-gray-200">
          <button
            onClick={() => setIsOpenConfirmDelete(false)}
            className="flex-1 py-3.5 text-center cursor-pointer hover:bg-gray-50 font-medium text-gray-700 transition-colors duration-150 border-r border-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 text-center cursor-pointer hover:bg-red-50 font-semibold text-red-600 transition-colors duration-150"
          >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmDelete;