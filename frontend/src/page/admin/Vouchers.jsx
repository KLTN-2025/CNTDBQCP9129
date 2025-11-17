import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import voucherApi from "../../api/voucherApi";
import { MdUpdateDisabled } from "react-icons/md";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import ModalCreateVoucher from "../../components/modal/adminVoucher/ModalCreateVoucher";
export default function Vouchers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [isOpenModalCreateVoucher, setIsOpenModalCreateVoucher] =
    useState(false);
  // const [isOpenModalUpdateProduct, setIsOpenModalUpdateProduct] = useState(false);
  // const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);
  // const [productSelected, setProductSelected] = useState(null);
  // const [productId, setProductId] = useState(null);

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
  console.log(vouchers);
  // const handleToggleStatus = async (product) => {
  //   try {
  //     const updatedStatus = !product.status;
  //     const res = await productApi.updateStatus(product._id, { status: updatedStatus });

  //     setProducts((prev) =>
  //       prev.map((p) =>
  //         p._id === product._id ? { ...p, status: res.status } : p
  //       )
  //     );

  //     toast.success("Cập nhật trạng thái thành công");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
  //   }
  // };

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
                          voucher.conditions.maxDiscountAmount > 0 &&
                          `(tối đa ${formatCurrencyVN(
                            voucher.conditions.maxDiscountAmount
                          )})`
                        }`
                      : formatCurrencyVN(voucher.discountValue)}
                  </td>

                  {/* Số lần dùng / tổng */}
                  <td className="px-6 py-4 text-sm">
                    {voucher.usedCount}/{voucher.usageLimit}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 text-sm">
                    <button
                      className={`${
                        voucher.status === "upcoming"
                          ? "bg-blue-600"
                          : voucher.status === "expired"
                          ? "bg-yellow-600"
                          : voucher.status === "active"
                          ? "bg-green-600"
                          : "bg-red-600"
                      } text-white px-4 py-2 whitespace-nowrap rounded-lg`}
                    >
                      {voucher.status === "upcoming"
                        ? "Chưa tới ngày"
                        : voucher.status === "expired"
                        ? "Đã hết hạn"
                        : voucher.status === "active"
                        ? "Đang hoạt động"
                        : "Vô hiệu hóa"}
                    </button>
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Vô hiệu hóa mã"
                      >
                        <MdUpdateDisabled className="w-4 h-4" />
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
    </div>
  );
}
