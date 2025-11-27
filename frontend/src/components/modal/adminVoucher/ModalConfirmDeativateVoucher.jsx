import React from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
const ModalConfirmDeativateVoucher = ({
  isOpenModalConfirmDeativateVoucher,
  setIsOpenModalConfirmDeativateVoucher,
  onConfirm, 
  deativateVoucherSelected
}) => {
  useLockBodyScroll(isOpenModalConfirmDeativateVoucher);
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalConfirmDeativateVoucher}
      onRequestClose={() => setIsOpenModalConfirmDeativateVoucher(false)}
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
          borderRadius: "0.5rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "400px",
        },
      }}
    >
      <div
        transition={{ duration: 0.2 }}
        className="bg-color-dash overflow-hidden rounded-2xl w-full flex flex-col items-center gap-y-2 select-none"
      >
        {/* Nội dung thông báo */}
        <div className="w-full border-b-2 py-4 text-center px-4">
          <p className="font-bold">Bạn có chắc chắn muốn vô hiệu hóa voucher {deativateVoucherSelected.code}</p>
        </div>
        <div
          onClick={onConfirm}
          className="w-full py-3 text-center cursor-pointer hover:bg-color-note font-semibold text-red-500"
        >
          Vô hiệu hóa
        </div>

        {/* Nút Hủy */}
        <div
          onClick={() => setIsOpenModalConfirmDeativateVoucher(false)}
          className="w-full py-3 text-center cursor-pointer hover:bg-color-note font-semibold text-black border-t-2"
        >
          Hủy
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmDeativateVoucher;
