import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import productApi from "../../api/productApi";
import ModalCreateProduct from "../../components/modal/adminProduct/ModalCreateProduct";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import ModalUpdateProduct from "../../components/modal/adminProduct/ModalUpdateProduct";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isOpenModalCreateProduct, setIsOpenModalCreateProduct] =
    useState(false);
  const [isOpenModalUpdateProduct, setIsOpenModalUpdateProduct] =
    useState(false);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  const [productSelected, setProductSelected] = useState(null);
  useEffect(() => {
    document.title = "Quản lý sản phẩm";
  }, []);
  // Lấy danh sách sản phẩm
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await productApi.getAllProducts();
        setProducts(res);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi tải sản phẩm");
      }
    };
    getAllProducts();
  }, []);

  // Xóa sản phẩm
  const handleRemoveProduct = async (id) => {
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
    } finally {
      setIsOpenModalConfirmDelete(false);
    }
  };

  // Toggle tình trạng
  const handleToggleStatus = async (product) => {
    try {
      const updatedStatus = !product.status;
      const res = await productApi.updateStatus(product._id, {
        status: updatedStatus,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, status: res.status } : p
        )
      );

      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý sản phẩm
            </h2>
            <p className="text-gray-600 mt-1">
              Danh sách sản phẩm trên website
            </p>
          </div>
          <button
            onClick={() => setIsOpenModalCreateProduct(true)}
            className="flex items-center cursor-pointer space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên sản phẩm..."
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
                "Tên sản phẩm",
                "Loại sản phẩm",
                "Hình ảnh",
                "Giá",
                "Mô tả",
                "Khuyến mãi",
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
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm truncate max-w-[200px]">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.productCategoryId?.name || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-[160px]">
                    {formatCurrencyVN(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-[160px]">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 text-sm">{product.discount}%</td>

                  {/* Nút toggle tình trạng */}
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      className={`${
                        product.status ? "bg-green-600" : "bg-red-600"
                      } text-white cursor-pointer px-4 py-2 whitespace-nowrap rounded-lg transition-colors`}
                    >
                      {product.status ? "Còn hàng" : "Hết hàng"}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-4">
                      {/* Nút sửa */}
                      <button
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={() => {
                          setProductSelected(product);
                          setIsOpenModalUpdateProduct(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Nút xóa */}
                      <button
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => {
                          setProductSelected(product);
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

      {/* Modal thêm sản phẩm */}
      {isOpenModalCreateProduct && (
        <ModalCreateProduct
          isOpenModalCreateProduct={isOpenModalCreateProduct}
          setIsOpenModalCreateProduct={setIsOpenModalCreateProduct}
          setProducts={setProducts}
        />
      )}

      {/* Modal cập nhật sản phẩm */}
      {isOpenModalUpdateProduct && productSelected && (
        <ModalUpdateProduct
          isOpenModalUpdateProduct={isOpenModalUpdateProduct}
          setIsOpenModalUpdateProduct={setIsOpenModalUpdateProduct}
          setProducts={setProducts}
          product={productSelected}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isOpenModalConfirmDelete && (
        <ModalConfirmDelete
          content={`Bạn có chắn chắn muốn xóa sản phẩm ${productSelected.name}?`}
          isOpenConfirmDelete={isOpenModalConfirmDelete}
          setIsOpenConfirmDelete={setIsOpenModalConfirmDelete}
          onConfirm={() => handleRemoveProduct(productSelected._id)}
        />
      )}
    </div>
  );
}
