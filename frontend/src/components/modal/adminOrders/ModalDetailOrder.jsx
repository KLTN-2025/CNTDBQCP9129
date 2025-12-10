import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import { formatCurrencyVN } from "../../../utils/formatCurrencyVN";
import { useMemo } from "react";
const ModalOrderDetail = ({ isOpenModal, setIsOpenModal, orderData }) => {
  useLockBodyScroll(isOpenModal);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const subTotal = useMemo(() => {
    return orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [orderData.items]);
  const getStatusBadge = (status) => {
    const statusConfig = {
      PROCESSING: { label: "Đang xử lý", color: "bg-yellow-500" },
      COMPLETED: { label: "Hoàn thành", color: "bg-green-500" },
      CANCELLED: { label: "Đã hủy", color: "bg-red-500" },
    };
    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-500",
    };
    return (
      <span
        className={`${config.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      SUCCESS: { label: "Thành công", color: "bg-green-500" },
      PENDING: { label: "Chờ thanh toán", color: "bg-yellow-500" },
      FAILED: { label: "Thất bại", color: "bg-red-500" },
    };
    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-500",
    };
    return (
      <span
        className={`${config.color} text-white px-2 py-1 rounded text-xs font-medium`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      VNPAY: "VNPay",
      CASH: "Tiền mặt",
    };
    return methods[method] || method;
  };

  const getOrderTypeLabel = (type) => {
    const types = {
      ONLINE: "Đơn hàng online",
      OFFLINE: "Đơn hàng tại quầy",
    };
    return types[type] || type;
  };

  if (!orderData) return null;

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModal}
      onRequestClose={() => setIsOpenModal(false)}
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
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Chi tiết đơn hàng</h2>
              <p className="text-sm">Mã đơn: #{orderData._id.slice(-8)}</p>
            </div>
            <button
              onClick={() => setIsOpenModal(false)}
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
          {/* Trạng thái đơn hàng */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Trạng thái đơn</p>
                {getStatusBadge(orderData.status)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Thanh toán</p>
                {getPaymentStatusBadge(orderData.paymentStatus)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Loại đơn hàng</p>
                <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {getOrderTypeLabel(orderData.orderType)}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin khách hàng */}
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
              Thông tin khách hàng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Họ tên:</span>
                <span className="font-medium text-gray-900">
                  {orderData.userId?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">
                  {orderData.userId?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Vai trò:</span>
                <span className="font-semibold uppercase text-blue-600">
                  {orderData.userId?.role || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin giao hàng */}
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Thông tin giao hàng
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Người nhận:</span>
                <span className="font-medium text-gray-900">
                  {orderData.delivery?.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="font-medium text-gray-900">
                  {orderData.delivery?.phone}
                </span>
              </div>
              {orderData.delivery?.address && (
                <div className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="font-medium text-right max-w-md text-gray-900">
                    {orderData.delivery.address}
                  </span>
                </div>
              )}
              {orderData.delivery?.note && (
                <div className="flex justify-between items-start py-2">
                  <span className="text-gray-600">Ghi chú:</span>
                  <span className="font-medium text-right max-w-md italic text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    {orderData.delivery.note}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sản phẩm */}
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Danh sách sản phẩm ({orderData.items?.length || 0} món)
            </h3>
            <div className="space-y-3">
              {orderData.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.name || "Sản phẩm"}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <p className="text-gray-600">
                        Số lượng:{" "}
                        <span className="font-medium text-gray-900">
                          {item.quantity}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Đơn giá:{" "}
                        <span className="font-medium text-blue-600">
                          {formatCurrencyVN(item.price || 0)}
                        </span>
                      </p>
                    </div>
                    {item.note && (
                      <p className="text-xs text-orange-600 mt-1 italic">
                        Ghi chú: {item.note}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrencyVN(
                        (item.price || 0) * (item.quantity || 0)
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin thanh toán */}
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Thông tin thanh toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium text-gray-900">
                  {getPaymentMethodLabel(orderData.paymentMethod)}
                </span>
              </div>

              {orderData.paymentMethod === "VNPAY" && (
                <>
                  {orderData.vnp_TxnRef && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Mã tham chiếu:</span>
                      <span className="font-medium text-gray-900">
                        #{orderData.vnp_TxnRef.slice(-8)}
                      </span>
                    </div>
                  )}
                  {orderData.vnp_TransactionNo && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Mã giao dịch VNPay:</span>
                      <span className="font-medium text-blue-600">
                        {orderData.vnp_TransactionNo}
                      </span>
                    </div>
                  )}
                  {orderData.vnp_PayDate && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">
                        Thời gian thanh toán:
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatDate(orderData.vnp_PayDate)}
                      </span>
                    </div>
                  )}
                  {orderData.vnp_Amount && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Số tiền VNPay:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrencyVN(orderData.vnp_Amount)}
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className="border-t-2 border-gray-200 pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Tổng tiền sản phẩm:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrencyVN(subTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Phí ship: </span>
                  <span className="font-semibold text-gray-900">
                    {orderData.delivery?.address
                      ? formatCurrencyVN(20000)
                      : formatCurrencyVN(0)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrencyVN(
                      (orderData.totalPrice || 0) +
                        (orderData.voucherDiscount || 0)
                    )}
                  </span>
                </div>

                {orderData.voucherDiscount > 0 && (
                  <>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                          />
                        </svg>
                        Giảm giá voucher:
                      </span>
                      <span className="font-semibold text-red-600">
                        -{formatCurrencyVN(orderData.voucherDiscount)}
                      </span>
                    </div>
                    {orderData.voucherId?.code && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Mã voucher:</span>
                        <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {orderData.voucherId.code}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-blue-200">
                  <span className="text-gray-900">Tổng thanh toán:</span>
                  <span className="text-blue-600">
                    {formatCurrencyVN(orderData.totalPrice || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

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
                  <p className="text-gray-600 mb-1">Ngày tạo đơn</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(orderData.createdAt)}
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
                    {formatDate(orderData.updatedAt)}
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

export default ModalOrderDetail;
