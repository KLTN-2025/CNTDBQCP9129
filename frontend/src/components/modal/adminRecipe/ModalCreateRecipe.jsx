import { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import recipeApi from "../../../api/recipeApi";
import ingredientApi from "../../../api/ingredientApi";
import productApi from "../../../api/productApi";
import { IoMdRemove } from "react-icons/io";

const ModalCreateRecipe = ({
  isOpenModalCreateRecipe,
  setIsOpenModalCreateRecipe,
  setRecipes,
}) => {
  useLockBodyScroll(isOpenModalCreateRecipe);

  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    productId: "",
    items: [
      {
        ingredientId: "",
        quantity: "",
        unit: "",
      },
    ],
  });

  // Lấy danh sách nguyên liệu + sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientRes, productRes] = await Promise.all([
          ingredientApi.getAll(),
          productApi.getAllProducts(),
        ]);
        setIngredients(ingredientRes);
        setProducts(productRes);
      } catch (error) {
        console.log(error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };
    if (isOpenModalCreateRecipe) fetchData();
  }, [isOpenModalCreateRecipe]);

  // Thay đổi input trong từng item
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Nếu user chọn nguyên liệu → tự lấy đơn vị
    if (field === "ingredientId") {
      const selectedIngredient = ingredients.find((i) => i._id === value);
      newItems[index].unit = selectedIngredient ? selectedIngredient.unit : "";
    }

    setFormData({ ...formData, items: newItems });
  };

  // Thêm dòng nguyên liệu
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ingredientId: "", quantity: "", unit: "" }],
    }));
  };

  // Xóa dòng nguyên liệu
  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Submit
  const handleSubmit = async () => {
    if (isLoading) return;

    if (!formData.productId) {
      toast.error("Vui lòng chọn món!");
      return;
    }

    for (let item of formData.items) {
      if (!item.ingredientId || !item.quantity) {
        return toast.error("Vui lòng nhập đầy đủ thông tin nguyên liệu!");
      }
      if (item.quantity < 1) {
        return toast.error("Số lượng của nguyên liệu phải lớn hơn 1");
      }
    }
    const ids = formData.items.map((i) => i.ingredientId);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return toast.error("Công thức có chứa nguyên liệu trùng nhau!");
    }

    try {
      setIsLoading(true);
      const response = await recipeApi.create({
        productId: formData.productId,
        items: formData.items.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: Number(i.quantity),
          unit: i.unit,
        })),
      });

      if (!response.message) {
        toast.success("Thêm công thức thành công!");
        setRecipes((prev) => [...prev, response]);
        setIsOpenModalCreateRecipe(false);
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi thêm công thức");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateRecipe}
      onRequestClose={() => setIsOpenModalCreateRecipe(false)}
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
          bottom: "auto",
          padding: 0,
          overflow: "auto",
          border: "none",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "600px",
        },
      }}
    >
      <div className="bg-white rounded-md w-full flex flex-col select-none">
        {/* Header */}
        <div className="w-full bg-green-700 text-white py-3 px-4">
          <p className="font-bold text-lg">Thêm công thức mới</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Chọn sản phẩm */}
          <div>
            <label className="font-medium">Chọn món *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={(e) =>
                setFormData({ ...formData, productId: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Chọn món trong thực đơn --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Danh sách nguyên liệu */}
          <div>
            <label className="font-medium">Danh sách nguyên liệu *</label>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-center border rounded-lg p-3"
                >
                  <div className="col-span-5">
                    <select
                      value={item.ingredientId}
                      onChange={(e) =>
                        handleItemChange(index, "ingredientId", e.target.value)
                      }
                      className="w-full px-2 py-2 border rounded-md"
                    >
                      <option value="">-- Nguyên liệu --</option>
                      {ingredients.map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Số lượng"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full px-2 py-2 border rounded-md"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Đơn vị"
                      value={item.unit}
                      readOnly
                      className="w-full px-2 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      className="text-red-600 text-lg cursor-pointer"
                      onClick={() => handleRemoveItem(index)}
                      title="Xóa nguyên liệu"
                    >
                      <IoMdRemove className="text-3xl"/>
                    </button>
                  </div>
                </div>
              ))}

              <button
                className="text-green-600 border border-green-600 px-3 py-1 rounded-md mt-2 text-sm"
                onClick={handleAddItem}
              >
                + Thêm nguyên liệu
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 py-4 border-t">
          <button
            className="w-full border px-4 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateRecipe(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-700 w-full text-white flex items-center justify-center rounded-md px-4 py-2 cursor-pointer"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <img
                className="object-cover w-7 h-7 rounded-full"
                src="/loading.gif"
                alt="đang tải"
              />
            ) : (
              <p>Thêm công thức</p>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateRecipe;
