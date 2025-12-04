import React from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";

const ModalConfirmCompleteOrder = ({
  isOpenConfirmComplete,
  setIsOpenConfirmComplete,
  onConfirm,
  orderData,
}) => {
  useLockBodyScroll(isOpenConfirmComplete);
  
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenConfirmComplete}
      onRequestClose={() => setIsOpenConfirmComplete(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "15rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "0.75rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "450px",
        },
      }}
    >
      <div className="overflow-hidden rounded-2xl w-full flex flex-col items-center select-none">
        {/* Icon & Tiêu đề */}
        <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 py-6 px-6 text-center border-b-2 border-green-200">
          <div className="flex justify-center mb-3">
            <div className="bg-green-500 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="font-bold text-lg text-gray-800">Xác nhận hoàn thành đơn hàng</p>
        </div>

        {/* Nội dung */}
        <div className="w-full py-6 px-6">
          <p className="text-center text-gray-700 mb-4">
            Bạn có chắc chắn muốn hoàn thành đơn hàng này không?
          </p>
          
          {orderData && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn:</span>
                <span className="font-semibold text-gray-900">#{orderData._id?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Khách hàng:</span>
                <span className="font-semibold text-gray-900">{orderData.delivery?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-semibold text-green-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderData.totalPrice)}
                </span>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-4 italic">
            Sau khi hoàn thành, trạng thái đơn hàng sẽ không thể thay đổi
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col">
          <div
            onClick={onConfirm}
            className="w-full py-4 text-center cursor-pointer hover:bg-green-50 font-semibold text-green-600 border-t-2 transition-colors"
          >
            Xác nhận hoàn thành
          </div>

          <div
            onClick={() => setIsOpenConfirmComplete(false)}
            className="w-full py-4 text-center cursor-pointer hover:bg-gray-100 font-semibold text-gray-700 border-t-2 transition-colors"
          >
            Hủy
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmCompleteOrder;