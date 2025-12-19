import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import importReceiptApi from "../../api/importReceiptApi";
import ModalCreateImportReceipt from "../../components/modal/importReceipt/ModalCreateImportReceipt";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import { AiOutlineEye } from "react-icons/ai";
import ModalDetailReceipt from "../../components/modal/importReceipt/ModalDetailReceipt";
import ModalCreateExportReceipt from "../../components/modal/importReceipt/ModalCreateExportReceipt";
import { FaMinus } from "react-icons/fa";
import { getTodayString } from "../../utils/getTodayString";
export default function ImportReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [isOpenModalCreateImportReceipt, setIsOpenModalCreateImportReceipt] = useState(false);
  const [isOpenModalCreateExportReceipt, setIsOpenModalCreateExportReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isOpenModalDetailReceipt, setIsOpenModalDetailReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  const loadReceipts = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await importReceiptApi.getAll({ startDate, endDate });
      setReceipts(res.receipts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tải phiếu nhập kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, [startDate, endDate]);

  useEffect(() => {
    document.title = "Quản lý phiếu nhập/xuất";
  }, []);

  // Quick date selections
  const handleQuickDate = (type) => {
    const today = new Date();
    const todayStr = getTodayString();

    switch (type) {
      case "today":
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        const str = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(y.getDate()).padStart(2, "0")}`;
        setStartDate(str);
        setEndDate(str);
        break;
      }
      case "week": {
        const w = new Date(today);
        w.setDate(today.getDate() - 7);
        const str = `${w.getFullYear()}-${String(w.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(w.getDate()).padStart(2, "0")}`;
        setStartDate(str);
        setEndDate(todayStr);
        break;
      }
      case "month": {
        const m = new Date(today);
        m.setDate(today.getDate() - 30); // chính xác 30 ngày
        const str = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(m.getDate()).padStart(2, "0")}`;
        setStartDate(str);
        setEndDate(todayStr);
        break;
      }
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý phiếu nhập/xuất kho
            </h2>
            <p className="text-gray-600 mt-1">
              Danh sách phiếu nhập/xuất kho ({receipts.length} phiếu)
            </p>
          </div>
          <div className="flex gap-x-3">
            <button
              onClick={() => setIsOpenModalCreateExportReceipt(true)}
              className="flex items-center cursor-pointer space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FaMinus className="w-5 h-5" />
              <span>Xuất kho</span>
            </button>
            <button
              onClick={() => setIsOpenModalCreateImportReceipt(true)}
              className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Nhập kho</span>
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          {/* Quick buttons */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {[
              { key: "today", label: "Hôm nay" },
              { key: "yesterday", label: "Hôm qua" },
              { key: "week", label: "7 ngày" },
              { key: "month", label: "30 ngày" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => handleQuickDate(btn.key)}
                className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={getTodayString()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "STT",
                "Loại phiếu",
                "Ngày tạo",
                "Số nguyên liệu",
                "Tổng tiền",
                "Ghi chú",
                "Thao tác",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {receipts.map((receipt, index) => (
              <tr
                key={receipt._id}
                className={`hover:opacity-80 transition-opacity ${
                  receipt.type === "EXPORT" ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <td className="px-6 py-4 text-sm">{index + 1}</td>

                {/* Loại phiếu */}
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      receipt.type === "EXPORT"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {receipt.type === "EXPORT" ? "Xuất kho" : "Nhập kho"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  {formatDatetimeVN(receipt.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-medium">
                    {receipt.items.length} 
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-sm font-semibold ${
                    receipt.type === "EXPORT"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {formatCurrencyVN(
                    receipt.items.reduce(
                      (sum, item) => sum + Number(item.totalCost),
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                  {receipt.note ? receipt.note : "Không có"}
                </td>

                <td className="px-6 py-4 text-sm">
                  <button
                    className="text-orange-600 hover:text-orange-800 cursor-pointer transition-colors"
                    title="Chi tiết phiếu"
                    onClick={() => {
                      setReceiptData(receipt);
                      setIsOpenModalDetailReceipt(true);
                    }}
                  >
                    <AiOutlineEye className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-500 mt-2">Đang tải phiếu...</p>
          </div>
        )}

        {receipts.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Không có phiếu nào trong khoảng thời gian này
          </div>
        )}
      </div>

      {/* Modal thêm phiếu nhập */}
      {isOpenModalCreateImportReceipt && (
        <ModalCreateImportReceipt
          isOpenModalCreateImportReceipt={isOpenModalCreateImportReceipt}
          setIsOpenModalCreateImportReceipt={setIsOpenModalCreateImportReceipt}
          setReceipts={setReceipts}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {isOpenModalCreateExportReceipt && (
        <ModalCreateExportReceipt
          isOpenModalCreateExportReceipt={isOpenModalCreateExportReceipt}
          setIsOpenModalCreateExportReceipt={setIsOpenModalCreateExportReceipt}
          setReceipts={setReceipts}
                    startDate={startDate}
          endDate={endDate}
        />
      )}
      {/* Modal chi tiết phiếu nhập */}
      {isOpenModalDetailReceipt && (
        <ModalDetailReceipt
          isOpenModalDetailReceipt={isOpenModalDetailReceipt}
          setIsOpenModalDetailReceipt={setIsOpenModalDetailReceipt}
          receiptData={receiptData}
        />
      )}
    </div>
  );
}