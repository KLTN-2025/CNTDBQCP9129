import React from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";

const ModalConfirm = ({
  title = "Xác nhận",
  content,
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Xác nhận",
  confirmColor = "green", // green | orange
}) => {
  useLockBodyScroll(isOpen);

  const colorMap = {
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      hover: "hover:bg-green-50",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      hover: "hover:bg-orange-50",
    },
  };

  const color = colorMap[confirmColor];

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpen}
      onRequestClose={onClose}
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
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <div className="overflow-hidden rounded-2xl w-full flex flex-col items-center select-none bg-white">
        {/* Icon */}
        <div className="w-full pt-8 pb-4 flex justify-center">
          <div
            className={`w-16 h-16 rounded-full ${color.bg} flex items-center justify-center`}
          >
            <svg
              className={`w-8 h-8 ${color.text}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-6 pb-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{content}</p>
        </div>

        {/* Actions */}
        <div className="w-full flex border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 cursor-pointer hover:bg-gray-50 font-medium text-gray-700 border-r border-gray-200"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 cursor-pointer py-3.5 font-semibold ${color.text} ${color.hover}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
