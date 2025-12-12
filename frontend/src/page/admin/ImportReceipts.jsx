import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import importReceiptApi from "../../api/importReceiptApi"
import { IoIosWarning } from "react-icons/io";
export default function ImportReceipts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  const [isOpenModalCreateIngredient, setIsOpenModalCreateIngredient] =
    useState(false);
  const [isOpenModalUpdateIngredient, setIsOpenModalUpdateIngredient] =
    useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // Lấy danh sách nguyên liệu trong kho
  useEffect(() => {
    const getAllIngredients = async () => {
      try {
        const res = await importReceiptApi.getAll();
        setReceipts(res);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lỗi khi tải nguyên liệu trong kho"
        );
      }
    };
    getAllIngredients();
  }, []);


  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý phiếu nhập kho
            </h2>
            <p className="text-gray-600 mt-1">Danh sách phiếu nhập kho</p>
          </div>
          <button
            onClick={() => setIsOpenModalCreateIngredient(true)}
            className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nhập kho</span>
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên nguyên liệu trong kho..."
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
                "Ngày tạo phiếu nhập",
                "Số nguyên liệu đã nhập",
                "Tổng tiền phiếu nhập",
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
            {receipts
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((receipts, index) => (
                <tr key={receipts._id} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                    {ingredient.name}
                  </td>
                  <td className="px-6 py-4 items-center text-sm truncate max-w-[200px]">
                    <div className="flex  gap-x-2">
                      {(ingredient.unit === "cái" &&
                        ingredient.quantity <= 5) ||
                      (ingredient.unit !== "cái" &&
                        ingredient.quantity <= 500) ? (
                        <IoIosWarning
                          className="text-xl text-yellow-400"
                          title="Nguyên liệu sắp hết"
                        />
                      ) : null}
                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-[160px]">
                    {formatCurrencyVN(ingredient.totalCost)}
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-[160px]">
                    {formatCurrencyVN(ingredient.perUnitCost)} / 1
                    {ingredient.unit}
                  </td> */}
                  {/* Nút toggle tình trạng */}

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      {/* Nút sửa */}
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        // onClick={() => {
                        //   setSelectedIngredient(ingredient);
                        //   setIsOpenModalUpdateIngredient(true);
                        // }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm nguyên liệu trong kho */}
      {/* {isOpenModalCreateIngredient && (
        <ModalCreateIngredient
          isOpenModalCreateIngredient={isOpenModalCreateIngredient}
          setIsOpenModalCreateIngredient={setIsOpenModalCreateIngredient}
          setIngredients={setIngredients}
        />
      )} */}
    </div>
  );
}
