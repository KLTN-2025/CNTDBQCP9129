import { useEffect, useState } from "react";
import { Plus, Search, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import voucherApi from "../../api/voucherApi";
import { MdUpdateDisabled } from "react-icons/md";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import ModalCreateVoucher from "../../components/modal/adminVoucher/ModalCreateVoucher";
import ModalConfirmDeativateVoucher from "../../components/modal/adminVoucher/ModalConfirmDeativateVoucher";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import { MdDelete } from "react-icons/md";
export default function Vouchers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [isOpenModalCreateVoucher, setIsOpenModalCreateVoucher] =
    useState(false);
  const [
    isOpenModalConfirmDeativateVoucher,
    setIsOpenModalConfirmDeativateVoucher,
  ] = useState(false);
  const [deativateVoucherSelected, setDeativateVoucherSelected] =
    useState(null);
  const [voucherSelected, setVoucherSelected] = useState(null);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  // Lấy danh sách sản phẩm
  useEffect(() => {
    const getAllVouchers = async () => {
      try {
        const res = await voucherApi.getAllVouchers();
        setVouchers(res);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi tải voucher");
      }
    };
    getAllVouchers();
  }, []);
  useEffect(() => {
    document.title = "Quản lý voucher";
  }, []);
  const handleClickDeactivateVoucher = async (voucherId) => {
    console.log(voucherId);
    try {
      const res = await voucherApi.deactivateVoucher(voucherId);
      setVouchers((prev) =>
        prev.map((v) =>
          v._id === voucherId ? { ...v, status: res.status } : v
        )
      );

      toast.success("Vô hiệu hóa voucher thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi vô hiệu hóa voucher");
    } finally {
      setIsOpenModalConfirmDeativateVoucher(false);
    }
  };
    const handleClickDeleteVoucher = async (voucherId) => {
    try {
      await voucherApi.deleteVoucher(voucherId);
      setVouchers((prev) =>
        prev.filter((v) => v._id !== voucherId)
      );
      toast.success("Xóa voucher thành công");
      setIsOpenModalConfirmDeativateVoucher(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi vô hiệu hóa voucher");
    } finally {
      setIsOpenModalConfirmDelete(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý voucher
            </h2>
            <p className="text-gray-600 mt-1">Danh sách voucher</p>
          </div>
          <button
            onClick={() => setIsOpenModalCreateVoucher(true)}
            className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm voucher</span>
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm mã voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "STT",
                "Mã voucher",
                "Mô tả (Điều kiện)",
                "Lượt / Khách",
                "Hình ảnh",
                "Bắt đầu",
                "Giá trị",
                "Đã sử dụng / Số lượng mã",
                "Tình trạng",
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
            {vouchers
              .filter((v) =>
                v.code.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((voucher, index) => (
                <tr key={voucher._id} className="hover:bg-gray-50">
                  {/* STT */}
                  <td className="px-6 py-4 text-sm max-w-[10px]">
                    {index + 1}
                  </td>

                  {/* Code */}
                  <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                    {voucher.code}
                  </td>
                  {/* Mô tả */}
                  <td className="px-6 py-4 text-sm max-w-[300px]">
                    {voucher.description} (đơn hàng từ{" "}
                    {formatCurrencyVN(voucher.conditions.minOrderValue)}
                    {voucher.discountType === "percent"
                      ? `, giảm ${voucher.discountValue}%${
                          voucher.conditions.maxDiscountAmount != null &&
                          voucher.conditions.maxDiscountAmount > 0
                            ? `, tối đa ${formatCurrencyVN(
                                voucher.conditions.maxDiscountAmount
                              )}`
                            : ""
                        }`
                      : `, giảm ${formatCurrencyVN(voucher.discountValue)}`}
                    {voucher.conditions.applicableCategories.length > 0
                      ? `, cho đơn hàng có tất cả sản phẩm trong danh mục ${voucher.conditions.applicableCategories
                          .map((cat) => cat.name.toLowerCase())
                          .join(", ")}`
                      : ", áp dụng cho tất cả sản phẩm"}
                    )
                  </td>

                  {/* Per user limit */}
                  <td className="px-6 py-4 text-sm">
                    {voucher.perUserLimit} / account
                  </td>

                  {/* Image */}
                  <td className="px-6 py-4 shrink-0">
                    <img
                      src={voucher.image}
                      alt={voucher.code}
                      className="w-18 h-18 object-contain rounded-xl shrink-0"
                    />
                  </td>

                  {/* Thời gian */}
                  <td className="px-6 py-4 text-sm max-w-[240px]">
                    {`${formatDatetimeVN(
                      voucher.startDate
                    )} đến ${formatDatetimeVN(voucher.endDate)}`}
                  </td>

                  {/* Giá trị giảm */}
                  <td className="px-6 py-4 text-sm">
                    {voucher.discountType === "percent"
                      ? `${voucher.discountValue}% ${
                          voucher.conditions.maxDiscountAmount > 0
                            ? `(tối đa ${formatCurrencyVN(
                                voucher.conditions.maxDiscountAmount
                              )})`
                            : ""
                        }`
                      : formatCurrencyVN(voucher.discountValue)}
                  </td>

                  {/* Số lần dùng / tổng */}
                  <td className="px-6 py-4 text-sm">
                    {voucher.usedCount}/{voucher.usageLimit}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-2 py-1 text-sm">
                    <td
                      className={`${
                        voucher.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : voucher.status === "expired"
                          ? "bg-yellow-100 text-yellow-700"
                          : voucher.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } px-2 py-1 whitespace-nowrap rounded-lg`}
                    >
                      {voucher.status === "upcoming"
                        ? "Chưa tới ngày"
                        : voucher.status === "expired"
                        ? "Đã hết hạn"
                        : voucher.status === "active"
                        ? "Đang hoạt động"
                        : "Vô hiệu hóa"}
                    </td>
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Vô hiệu hóa voucher"
                        onClick={() => {
                          setIsOpenModalConfirmDeativateVoucher(true);
                          setDeativateVoucherSelected(voucher);
                        }}
                      >
                        <MdUpdateDisabled className="w-4 h-4" />
                      </button>
                      <button
                        className="text-yellow-600  cursor-pointer"
                        title="Xóa voucher"
                        onClick={() => {
                          setVoucherSelected(voucher);
                          setIsOpenModalConfirmDelete(true);
                        }}
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isOpenModalCreateVoucher && (
        <ModalCreateVoucher
          isOpenModalCreateVoucher={isOpenModalCreateVoucher}
          setIsOpenModalCreateVoucher={setIsOpenModalCreateVoucher}
          setVouchers={setVouchers}
        />
      )}
      {isOpenModalConfirmDeativateVoucher && (
        <ModalConfirmDeativateVoucher
          isOpenModalConfirmDeativateVoucher={
            isOpenModalConfirmDeativateVoucher
          }
          setIsOpenModalConfirmDeativateVoucher={
            setIsOpenModalConfirmDeativateVoucher
          }
          onConfirm={() =>
            handleClickDeactivateVoucher(deativateVoucherSelected._id)
          }
          deativateVoucherSelected={deativateVoucherSelected}
        />
      )}
      {isOpenModalConfirmDelete && (
        <ModalConfirmDelete
          isOpenConfirmDelete={isOpenModalConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenModalConfirmDelete}
          content={`Bạn có chắc chắn muốn xóa voucher ${voucherSelected.code}`}
          onConfirm={() =>handleClickDeleteVoucher(voucherSelected._id)}
        />
      )}
    </div>
  );
}
