import React, { useMemo } from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import { formatCurrencyVN } from "../../../utils/formatCurrencyVN";
import { formatDatetimeVN } from "../../../utils/formatDatetimeVN";

const ModalDetailReceipt = ({
  isOpenModalDetailReceipt,
  setIsOpenModalDetailReceipt,
  receiptData,
}) => {
  console.log(receiptData);
  useLockBodyScroll(isOpenModalDetailReceipt);
  const totalCost = useMemo(() => {
    return receiptData?.items?.reduce(
      (sum, item) => sum + (item.totalCost || 0),
      0
    ) || 0;
  }, [receiptData?.items]);

  if (!receiptData) return null;
  console.log(receiptData);
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalDetailReceipt}
      onRequestClose={() => setIsOpenModalDetailReceipt(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "3rem",
          left: "auto",
          right: "auto",
          bottom: "3rem",
          padding: 0,
          border: "none",
          background: "white",
          overflow: "auto",
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: "900px",
        },
      }}
    >
      <div className="bg-white w-full flex flex-col select-none">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Chi tiết phiếu nhập</h2>
              <p className="text-sm">Mã phiếu: #{receiptData._id?.slice(-8)}</p>
            </div>
            <button
              onClick={() => setIsOpenModalDetailReceipt(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin người tạo */}
          {receiptData.createdBy && (
            <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Người tạo phiếu
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Họ tên:</span>
                  <span className="font-medium text-gray-900">
                    {receiptData.createdBy?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">
                    {receiptData.createdBy?.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách nguyên liệu */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Danh sách nguyên liệu ({receiptData.items?.length || 0} món)
            </h3>
            <div className="space-y-3">
              {receiptData.items?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex justify-between items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.ingredientName || "Nguyên liệu"}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <p className="text-gray-600">
                        Số lượng:{" "}
                        <span className="font-medium text-gray-900">
                          {item.quantity} {item.unit || ""}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Đơn giá:{" "}
                        <span className="font-medium text-blue-600">
                          {formatCurrencyVN(item.pricePerUnit || 0)}/{item.unit || "đơn vị"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-green-600 text-lg">
                      {formatCurrencyVN(item.totalCost || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng chi phí */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tổng chi phí
            </h3>
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-900">Tổng tiền nhập:</span>
                <span className="text-green-600">
                  {formatCurrencyVN(totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {receiptData.note && (
            <div className="border border-orange-200 rounded-lg p-5 bg-orange-50 shadow-sm">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Ghi chú
              </h3>
              <p className="text-gray-700 italic">{receiptData.note}</p>
            </div>
          )}

          {/* Thời gian */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-gray-600 mb-1">Ngày tạo phiếu</p>
                  <p className="font-semibold text-gray-900">
                    {formatDatetimeVN(receiptData.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <div>
                  <p className="text-gray-600 mb-1">Cập nhật lần cuối</p>
                  <p className="font-semibold text-gray-900">
                    {formatDatetimeVN(receiptData.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetailReceipt;