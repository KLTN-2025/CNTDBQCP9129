import React, { useState, useRef } from "react";
import ModalConditionsVoucher from "./modal/ModalConditionsVoucher";
const CouponItem = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);
  const [isOpenModalConditionsVoucher, setIsOpenModalConditionsVoucher] =
    useState(false);
  return (
    <div className="flex items-stretch gap-x-4 p-4 max-w-sm rounded-lg w-full bg-white shadow-sm shrink-0">
      <img
        src={voucher.image}
        className="w-24 h-24 rounded-lg object-cover"
        alt="giảm giá"
      />
      <div className="flex flex-col">
        <p className="font-bold whitespace-break-spaces">
          NHẬP MÃ: {voucher.code}
        </p>
        <p className="text-xs text-gray-400">- {voucher.description}</p>

        <div className="flex mt-2 items-center justify-between">
          <button
            onClick={() => {
              if (copied) return;
              navigator.clipboard.writeText(voucher.code);
              setCopied(true);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }

              timeoutRef.current = setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
            className={`px-3 py-1 ${
              !copied ? "bg-red-700" : "bg-red-400"
            } text-white rounded-full cursor-pointer`}
          >
            {!copied ? "Sao chép mã" : "Đã sao chép"}
          </button>

          <button className="text-sm text-blue-800 cursor-pointer"
           onClick={() => setIsOpenModalConditionsVoucher(true)}
          >
            Điều kiện
          </button>
        </div>
      </div>
      <ModalConditionsVoucher
        isOpenModalConditionsVoucher={isOpenModalConditionsVoucher}
        setIsOpenModalConditionsVoucher={setIsOpenModalConditionsVoucher}
        voucher={voucher}
      />
    </div>
  );
};

export default CouponItem;
