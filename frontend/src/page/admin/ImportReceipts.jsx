import { useEffect, useState } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import importReceiptApi from "../../api/importReceiptApi";
import ModalCreateImportReceipt from "../../components/modal/importReceipt/ModalCreateImportReceipt";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import { AiOutlineEye } from "react-icons/ai";
import ModalDetailReceipt from "../../components/modal/importReceipt/ModalDetailReceipt";
import ModalCreateExportReceipt from "../../components/modal/importReceipt/ModalCreateExportReceipt";
import { FaMinus } from "react-icons/fa";

export default function ImportReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [isOpenModalCreateImportReceipt, setIsOpenModalCreateImportReceipt] =
    useState(false);
  const [isOpenModalCreateExportReceipt, setIsOpenModalCreateExportReceipt] =
    useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isOpenModalDetailReceipt, setIsOpenModalDetailReceipt] =
    useState(false);

  // Date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);

  // Get today's date in YYYY-MM-DD format for max attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Lấy tất cả phiếu nhập
  const getAllReceipts = async () => {
    try {
      const res = await importReceiptApi.getAll();
      setReceipts(res);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi tải phiếu nhập kho"
      );
    }
  };

  // Lấy phiếu nhập theo khoảng thời gian
  const getReceiptsByDateRange = async () => {
    if (!startDate || !endDate) {
      toast.warning("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    try {
      setIsLoadingFilter(true);
      const res = await importReceiptApi.getByDateRange(startDate, endDate);
      setReceipts(res);
      toast.success(`Tìm thấy ${res.length} phiếu`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi lọc phiếu nhập theo ngày"
      );
    } finally {
      setIsLoadingFilter(false);
    }
  };

  // Reset filter
  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    getAllReceipts();
  };

  useEffect(() => {
    getAllReceipts();
  }, []);
  useEffect(() => {
    document.title = "Quản lý phiếu nhập";
  }, []); 
  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý phiếu nhập/xuất kho
            </h2>
            <p className="text-gray-600 mt-1">Danh sách phiếu nhập/xuất kho</p>
          </div>
          <div className="flex gap-x-4">
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
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">Lọc theo thời gian</h3>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            {/* Start Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                max={getTodayDate()}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* End Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                max={getTodayDate()}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={getReceiptsByDateRange}
              disabled={isLoadingFilter}
              className="px-6 py-2 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoadingFilter ? "Đang lọc..." : "Lọc"}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetFilter}
              className="px-6 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="Đặt lại thời gian"
            >
              Đặt lại
            </button>
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
                "Tổng tiền xuất/nhập",
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
                  receipt.type === "EXPORT" 
                    ? "bg-red-50" 
                    : "bg-green-50"
                }`}
              >
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                
                {/* Loại phiếu */}
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    receipt.type === "EXPORT"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {receipt.type === "EXPORT" ? "Xuất kho" : "Nhập kho"}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                  {formatDatetimeVN(receipt.createdAt)}
                </td>
                <td className="px-6 py-4 items-center text-sm truncate max-w-[200px]">
                  {receipt.items.length}
                </td>
                <td className={`px-6 py-4 text-sm truncate max-w-[160px] font-semibold ${
                  receipt.type === "EXPORT" 
                    ? "text-red-600" 
                    : "text-green-600"
                }`}>
                  {formatCurrencyVN(
                    receipt.items.reduce(
                      (sum, item) => sum + Number(item.totalCost),
                      0
                    )
                  )}
                </td>
                <td className="px-6 py-4 text-sm truncate max-w-[160px]">
                  {receipt.note ? receipt.note : "Không có"}
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="Chi tiết phiếu"
                      onClick={() => {
                        setReceiptData(receipt);
                        setIsOpenModalDetailReceipt(true);
                      }}
                    >
                      <AiOutlineEye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm phiếu nhập */}
      {isOpenModalCreateImportReceipt && (
        <ModalCreateImportReceipt
          isOpenModalCreateImportReceipt={isOpenModalCreateImportReceipt}
          setIsOpenModalCreateImportReceipt={setIsOpenModalCreateImportReceipt}
          setReceipts={setReceipts}
        />
      )}
      {isOpenModalCreateExportReceipt && (
        <ModalCreateExportReceipt
          isOpenModalCreateExportReceipt={isOpenModalCreateExportReceipt}
          setIsOpenModalCreateExportReceipt={setIsOpenModalCreateExportReceipt}
          setReceipts={setReceipts}
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