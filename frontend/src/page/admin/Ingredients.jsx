import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import ingredientApi from "../../api/ingredientApi";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import ModalCreateIngredient from "../../components/modal/adminIngredient/ModalCreateIngredient";
import ModalUpdateIngredient from "../../components/modal/adminIngredient/ModalUpdateIngredient";
import { IoIosWarning } from "react-icons/io";

export default function Ingredients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(false);
  const [isOpenModalCreateIngredient, setIsOpenModalCreateIngredient] = useState(false);
  const [isOpenModalUpdateIngredient, setIsOpenModalUpdateIngredient] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    document.title = "Quản lý kho";
  }, []); 
  // Lấy danh sách nguyên liệu trong kho
  useEffect(() => {
    const getAllIngredients = async () => {
      try {
        const res = await ingredientApi.getAll();
        setIngredients(res);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lỗi khi tải nguyên liệu trong kho"
        );
      }
    };
    getAllIngredients();
  }, []);

  // Xóa nguyên liệu trong kho
  const handleRemoveProduct = async (id) => {
    try {
      await ingredientApi.delete(id);
      setIngredients((prev) => prev.filter((p) => p._id !== id));
      toast.success("Xóa nguyên liệu trong kho thành công");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi xóa nguyên liệu trong kho"
      );
    } finally {
      setIsOpenModalConfirmDelete(false);
      setSelectedIngredient(null);
    }
  };

  // Toggle tình trạng (Còn hàng / Hết hàng)
  const handleToggleStatus = async (ingredient) => {
    try {
      const res = await ingredientApi.updateStatus(ingredient._id);

      setIngredients((prev) =>
        prev.map((ing) =>
          ing._id === ingredient._id ? { ...ing, status: res.newStatus } : ing
        )
      );

      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  // Mở modal update (chỉ truyền id, name, unit)
  const openUpdateModal = (ingredient) => {
    setSelectedIngredient({
      _id: ingredient._id,
      name: ingredient.name,
      unit: ingredient.unit,
    });
    setIsOpenModalUpdateIngredient(true);
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý nguyên liệu trong kho
            </h2>
            <p className="text-gray-600 mt-1">Danh sách nguyên liệu</p>
          </div>

          {/* Thêm nguyên liệu */}
          <button
            onClick={() => setIsOpenModalCreateIngredient(true)}
            className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm nguyên liệu</span>
          </button>
        </div>

        {/* Tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên nguyên liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng nguyên liệu */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "STT",
                "Tên nguyên liệu",
                "Số lượng",
                "Tổng tiền",
                "Đơn giá nguyên liệu mới nhất",
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
            {ingredients
              .filter((p) =>
                (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((ingredient, index) => (
                <tr key={ingredient._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>

                  <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                    {ingredient.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-x-2">
                      {(ingredient.unit === "cái" && ingredient.quantity < 100) ||
                      (ingredient.unit !== "cái" && ingredient.quantity < 500) ? (
                        <IoIosWarning
                          className="text-xl text-yellow-400"
                          title="Nguyên liệu sắp hết"
                        />
                      ) : null}

                      {ingredient.quantity} {ingredient.unit}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm max-w-[160px]">
                    {formatCurrencyVN(ingredient.totalCost ?? 0)}
                  </td>

                  <td className="px-6 py-4 text-sm max-w-[160px]">
                    {formatCurrencyVN(ingredient.lastPrice ?? 0)} / 1{ingredient.unit}
                  </td>

                  {/* Toggle trạng thái */}
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleStatus(ingredient)}
                      className={`${
                        ingredient.status ? "bg-green-600" : "bg-red-600"
                      } text-white cursor-pointer px-4 py-2 rounded-lg transition-colors`}
                    >
                      {ingredient.status ? "Còn hàng" : "Hết hàng"}
                    </button>
                  </td>

                  {/* Thao tác: Sửa (chỉ name/unit) & Xóa */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => openUpdateModal(ingredient)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => {
                          setSelectedIngredient(ingredient);
                          setIsOpenModalConfirmDelete(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm nguyên liệu */}
      {isOpenModalCreateIngredient && (
        <ModalCreateIngredient
          isOpenModalCreateIngredient={isOpenModalCreateIngredient}
          setIsOpenModalCreateIngredient={setIsOpenModalCreateIngredient}
          setIngredients={setIngredients}
        />
      )}

      {isOpenModalUpdateIngredient && selectedIngredient && (
        <ModalUpdateIngredient
          isOpenModalUpdateIngredient={isOpenModalUpdateIngredient}
          setIsOpenModalUpdateIngredient={setIsOpenModalUpdateIngredient}
          setIngredients={setIngredients}
          selectedIngredient={selectedIngredient}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isOpenModalConfirmDelete && selectedIngredient && (
        <ModalConfirmDelete
          content={`Bạn có chắn chắn muốn xóa nguyên liệu ${selectedIngredient.name}?`}
          isOpenConfirmDelete={isOpenModalConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenModalConfirmDelete}
          onConfirm={() => handleRemoveProduct(selectedIngredient._id)}
        />
      )}
    </div>
  );
}
