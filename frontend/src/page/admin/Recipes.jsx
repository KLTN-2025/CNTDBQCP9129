import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import recipeApi from "../../api/recipeApi";
import ModalCreateRecipe from "../../components/modal/adminRecipe/ModalCreateRecipe";
import ModalUpdateRecipe from "../../components/modal/adminRecipe/ModalUpdateRecipe";
export default function Recipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  const [isOpenModalCreateRecipe, setIsOpenModalCreateRecipe] = useState(false);
  const [isOpenModalUpdateRecipe, setIsOpenModalUpdateRecipe] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeId, setRecipeId] = useState(null);

  // Lấy danh sách công thức
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await recipeApi.getAll();
        setRecipes(res);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi tải công thức");
      }
    };
    getAllProducts();
  }, []);

  // Xóa công thức
  const handleRemoveProduct = async (id) => {
    try {
      await recipeApi.delete(id);
      setRecipes((prev) => prev.filter((p) => p._id !== id));
      setIsOpenModalConfirmDelete(false);
      toast.success("Xóa công thức thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa công thức");
    } finally {
      setRecipeId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý công thức
            </h2>
            <p className="text-gray-600 mt-1">Danh sách công thức</p>
          </div>
          <button
            onClick={() => setIsOpenModalCreateRecipe(true)}
            className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm công thức</span>
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên món..."
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
              {["STT", "Tên món", "Thành phần nguyên liệu", "Thao tác"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {recipes
              .filter((r) =>
                r.productId.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((recipe, index) => (
                <tr key={recipe._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm truncate max-w-[200px] whitespace-normal">
                    {recipe.productId.name}
                  </td>
                  <td className="px-6 py-4 text-sm truncate whitespace-normal">
                    {recipe.items.map((item, i) => (
                      <div className="space-y-2 flex gap-x-10">
                        <p className="min-w-xs">
                          Nguyên liệu {i + 1}: {item.ingredientId.name}
                        </p>
                        <p>
                          Số lượng: {item.quantity}
                          {item.unit}
                        </p>
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      {/* Nút sửa */}
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => {
                          setSelectedRecipe(recipe);
                          setIsOpenModalUpdateRecipe(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Nút xóa */}
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => {
                          setRecipeId(recipe._id);
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

      {/* Modal thêm công thức */}
      {isOpenModalCreateRecipe && (
        <ModalCreateRecipe
          isOpenModalCreateRecipe={isOpenModalCreateRecipe}
          setIsOpenModalCreateRecipe={setIsOpenModalCreateRecipe}
          setRecipes={setRecipes}
        />
      )}

      {/* Modal cập nhật công thức */}
      {ModalUpdateRecipe && selectedRecipe && (
        <ModalUpdateRecipe
          isOpenModalUpdateRecipe={isOpenModalUpdateRecipe}
          setIsOpenModalUpdateRecipe={setIsOpenModalUpdateRecipe}
          setRecipes={setRecipes}
          selectedRecipe={selectedRecipe}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isOpenModalConfirmDelete && (
        <ModalConfirmDelete
          content="Bạn có chắn chắn muốn xóa nguyên liệu này?"
          isOpenConfirmDelete={isOpenModalConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenModalConfirmDelete}
          onConfirm={() => handleRemoveProduct(recipeId)}
        />
      )}
    </div>
  );
}
