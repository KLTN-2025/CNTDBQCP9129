import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import voucherApi from "../../api/voucherApi";
import { MdUpdateDisabled } from "react-icons/md";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import {formatDatetimeVN} from "../../utils/formatDatetimeVN";
export default function Vouchers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vouchers, setVouchers] = useState([]);
  // const [isOpenModalCreateProduct, setIsOpenModalCreateProduct] = useState(false);
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
            // onClick={() => setIsOpenModalCreateProduct(true)}
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
                "Lượt/Khách",
                "Hình ảnh",
                "Bắt đầu",
                "Giá trị",
                "Số lượng mã",
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
                  <td className="px-6 py-4 text-sm max-w-[10px]">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                    {voucher.code}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-[300px]">
                    {voucher.description} (đơn hàng từ{" "}
                    {formatCurrencyVN(voucher.conditions.minOrderValue)}
                    {voucher.discountType === "percent" &&
                      `, giảm ${
                        voucher.discountValue
                      }% tối đa ${formatCurrencyVN(
                        voucher.conditions.maxDiscountAmount
                      )}`}
                    {voucher.conditions.applicableCategories.length > 0
                      ? `, cho đơn hàng có tất cả sản phẩm trong danh mục ${voucher.conditions.applicableCategories.map(
                          (category, i) =>
                            `${
                              i === 1 ? " ," : ""
                            } ${category.name.toLowerCase()}`
                        )}`
                      : ", áp dụng cho tất cả sản phẩm"}
                    )
                  </td>
                  <td className="px-6 py-4 text-sm ">
                    {voucher.perUserLimit} / account
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src="ádasd"
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm max-w-[240px]">
                    {`${formatDatetimeVN(voucher.startDate)} đến ${formatDatetimeVN(
                      voucher.endDate
                    )}`}
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-[160px]">
                    {voucher.discountType === "percent"
                      ? `${voucher.discountValue}%`
                      : `${formatCurrencyVN(voucher.discountValue)}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {voucher.usedCount}/{voucher.usageLimit}
                  </td>
                  {new Date() > new Date(voucher.endDate) ? (
                    <td className="px-6 py-4 text-sm">
                      <button className="bg-red-600 text-white cursor-pointer px-4 py-2 whitespace-nowrap rounded-lg">
                        Đã hết hạn
                      </button>
                    </td>
                  ) : (
                    <td className="px-6 py-4 text-sm">
                      <button
                        // onClick={() => handleToggleStatus(product)}
                        className={`${
                          voucher.status === "active"
                            ? "bg-green-600"
                            : "bg-yellow-500"
                        } text-white cursor-pointer px-4 py-2 whitespace-nowrap rounded-lg transition-colors`}
                      >
                        {voucher.status === "active"
                          ? "Đang hoạt động"
                          : "Không hoạt động"}
                      </button>
                    </td>
                  )}
                                    <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      {/* Nút sửa */}
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
    </div>
  );
}
