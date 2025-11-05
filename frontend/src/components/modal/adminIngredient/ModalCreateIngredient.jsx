import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import ingredientApi from "../../../api/ingredientApi";

const ModalCreateIngredient = ({
  isOpenModalCreateIngredient,
  setIsOpenModalCreateIngredient,
  setIngredients,
}) => {
  useLockBodyScroll(isOpenModalCreateIngredient);

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    quantity: "",
    totalCost: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async () => {
    if (isLoading) return;
    if (
      !formData.name.trim() ||
      !formData.unit.trim() ||
      !Number(formData.quantity) ||
      formData.totalCost == ""
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin nguyên liệu");
      return;
    }

    try {
      setIsLoading(true);
      const response = await ingredientApi.create({
        name: formData.name,
        unit: formData.unit,
        quantity: Number(formData.quantity),
        totalCost: Number(formData.totalCost),
      });

      if (!response.message) {
        toast.success("Thêm nguyên liệu thành công!");
        setIngredients((prev) => [...prev, response]);
        setIsOpenModalCreateIngredient(false);
      } else {
        toast.error(response.message || "Đã có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi thêm nguyên liệu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateIngredient}
      onRequestClose={() => setIsOpenModalCreateIngredient(false)}
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
          maxWidth: "450px",
        },
      }}
    >
      <div className="bg-white rounded-md w-full flex flex-col select-none">
        {/* Header */}
        <div className="w-full bg-green-700 text-white py-3 px-4">
          <p className="font-bold text-lg">Thêm nguyên liệu mới</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Tên nguyên liệu */}
          <div>
            <label className="font-medium">Tên nguyên liệu *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên nguyên liệu"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Đơn vị */}
          <div>
            <label className="font-medium">Đơn vị *</label>
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

          {/* Số lượng */}
          <div>
            <label className="font-medium">Số lượng *</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Nhập số lượng"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Tổng tiền */}
          <div>
            <label className="font-medium">Tổng tiền *</label>
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost}
              min="0"
              onChange={handleChange}
              placeholder="Nhập tổng tiền nhập"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-4 px-6 py-4 border-t">
          <button
            className="w-full border px-4 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateIngredient(false)}
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
              <p>Thêm mới</p>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateIngredient;
