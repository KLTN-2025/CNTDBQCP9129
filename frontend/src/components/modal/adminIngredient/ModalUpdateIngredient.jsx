import { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import ingredientApi from "../../../api/ingredientApi";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";

const ModalUpdateIngredient = ({
  isOpenModalUpdateIngredient,
  setIsOpenModalUpdateIngredient,
  selectedIngredient,
  setIngredients,
}) => {
  useLockBodyScroll(isOpenModalUpdateIngredient);

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    quantity: "",
    totalCost: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load nguyên liệu khi mở modal
  useEffect(() => {
    if (selectedIngredient) {
      setFormData({
        name: selectedIngredient.name || "",
        unit: selectedIngredient.unit || "",
        quantity: selectedIngredient.quantity || "",
        totalCost: selectedIngredient.totalCost || "",
      });
    }
  }, [selectedIngredient]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update name + unit
  const handleSubmit = async () => {
    if (isLoading) return;

    if (!formData.name.trim() || !formData.unit.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setIsLoading(true);

      const response = await ingredientApi.update(selectedIngredient._id, {
        name: formData.name,
        unit: formData.unit,
      });

      if (!response.message) {
        toast.success("Cập nhật nguyên liệu thành công!");

        setIngredients((prev) =>
          prev.map((item) =>
            item._id === selectedIngredient._id ? response : item
          )
        );

        setIsOpenModalUpdateIngredient(false);
      } else {
        toast.error(response.message || "Đã có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi cập nhật nguyên liệu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalUpdateIngredient}
      onRequestClose={() => setIsOpenModalUpdateIngredient(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "0.5rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "460px",
        },
      }}
    >
      <div className="overflow-hidden rounded-md w-full flex flex-col select-none">
        {/* Header */}
        <div className="w-full py-3 px-4 border-b border-gray-300">
          <p className="font-bold text-xl">Cập nhật nguyên liệu</p>
        </div>

        <div className="py-8 px-4 space-y-4">
          {/* Name */}
          <div>
            <p className="font-medium">Tên nguyên liệu *</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Nhập tên nguyên liệu"
            />
          </div>

          {/* Unit */}
          <div>
            <p className="font-medium">Đơn vị *</p>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Chọn đơn vị --</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="cái">cái</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-x-6 px-4 w-full py-6 border-t border-gray-200">
          <button
            className="w-full border px-2 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalUpdateIngredient(false)}
          >
            Hủy
          </button>

          <button
            className="bg-green-600 w-full text-white rounded-md px-2 py-2 cursor-pointer"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <img src="/loading.gif" alt="loading" className="w-7 h-7 mx-auto" />
            ) : (
              "Cập nhật"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateIngredient;
