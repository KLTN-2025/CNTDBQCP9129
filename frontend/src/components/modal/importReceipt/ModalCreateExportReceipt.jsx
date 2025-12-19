import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import ingredientApi from "../../../api/ingredientApi";
import importReceiptApi from "../../../api/importReceiptApi";
import useAuthStore from "../../../store/authStore";
import { IoIosRemoveCircle } from "react-icons/io";

const ModalCreateExportReceipt = ({
  isOpenModalCreateExportReceipt,
  setIsOpenModalCreateExportReceipt,
  setReceipts,
  startDate,
  endDate,
}) => {
  useLockBodyScroll(isOpenModalCreateExportReceipt);

  const { user } = useAuthStore();
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      note: "",
      items: [{ ingredientId: "", quantity: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (isOpenModalCreateExportReceipt) fetchIngredients();
  }, [isOpenModalCreateExportReceipt]);

  const fetchIngredients = async () => {
    try {
      const data = await ingredientApi.getAll();
      // Sắp xếp theo alphabet
      const sortedData = data.sort((a, b) =>
        a.name.localeCompare(b.name, "vi")
      );
      setIngredients(sortedData);
    } catch {
      toast.error("Lỗi tải nguyên liệu");
    }
  };

  // lọc nguyên liệu trùng
  const getAvailableIngredients = (index) => {
    const selectedIds = watch("items")
      .map((it, i) => (i !== index ? it.ingredientId : null))
      .filter(Boolean);

    return ingredients.filter((ing) => !selectedIds.includes(ing._id));
  };

  // Lấy thông tin nguyên liệu đã chọn
  const getSelectedIngredient = (ingredientId) => {
    return ingredients.find((ing) => ing._id === ingredientId);
  };

  const onSubmit = async (data) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const payload = {
        items: data.items.map((it) => ({
          ingredientId: it.ingredientId,
          quantity: Number(it.quantity),
        })),
        note: data.note.trim(),
        userId: user.id,
      };

      const res = await importReceiptApi.createExport(payload);

      if (res?._id) {
        toast.success("Xuất kho thành công");
        const createdDate = new Date(res.createdAt); 
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59`);

        if (createdDate >= start && createdDate <= end) {
          setReceipts((prev) => [res, ...prev]);
        }
        setIsOpenModalCreateExportReceipt(false);
        reset();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xuất kho thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateExportReceipt}
      onRequestClose={() => setIsOpenModalCreateExportReceipt(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          position: "relative",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          maxWidth: "550px",
          width: "100%",
          maxHeight: "90vh",
        },
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-md flex flex-col"
      >
        {/* Header */}
        <div className="bg-red-700 text-white px-4 py-3 font-bold text-lg">
          Tạo phiếu xuất kho
        </div>

        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          <p className="font-semibold">Danh sách nguyên liệu *</p>

          {fields.map((field, idx) => {
            const availableIngredients = getAvailableIngredients(idx);
            const selectedIngredient = getSelectedIngredient(
              watch(`items.${idx}.ingredientId`)
            );

            return (
              <div
                key={field.id}
                className="border p-3 rounded-lg relative space-y-3"
              >
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute top-2 right-2 text-red-600"
                  >
                    <IoIosRemoveCircle size={22} />
                  </button>
                )}

                {/* ingredient */}
                <div>
                  <label className="font-medium">Nguyên liệu</label>
                  <select
                    {...register(`items.${idx}.ingredientId`, {
                      required: true,
                    })}
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {availableIngredients.map((ing) => (
                      <option key={ing._id} value={ing._id}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hiển thị số lượng hiện tại và tổng tiền hiện tại */}
                {selectedIngredient && (
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                    <div>
                      <label className="text-sm text-gray-600">
                        Số lượng hiện tại
                      </label>
                      <p className="font-semibold text-gray-800">
                        {selectedIngredient.quantity} {selectedIngredient.unit}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Tổng tiền hiện tại
                      </label>
                      <p className="font-semibold text-gray-800">
                        {selectedIngredient.totalCost?.toLocaleString("vi-VN")}{" "}
                        ₫
                      </p>
                    </div>
                  </div>
                )}

                {/* quantity */}
                <div>
                  <label className="font-medium">Số lượng xuất *</label>
                  <input
                    type="text"
                    {...register(`items.${idx}.quantity`, {
                      required: true,
                      min: 1,
                    })}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => append({ ingredientId: "", quantity: "" })}
            className="w-full border border-red-700 text-red-700 py-2 rounded-md"
          >
            + Thêm nguyên liệu
          </button>

          {/* note */}
          <div>
            <label className="font-medium">Ghi chú *</label>
            <textarea
              {...register("note", {
                required: "Ghi chú không được để trống",
                validate: (value) =>
                  value.trim() !== "" || "Ghi chú không được để trống",
              })}
              className={`w-full border px-3 py-2 rounded-lg ${
                errors.note ? "border-red-500" : ""
              }`}
              rows={3}
              placeholder="Hết hạn / hỏng / kiểm kê..."
            />
            {errors.note && (
              <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-4 px-6 py-4 border-t">
          <button
            type="button"
            onClick={() => setIsOpenModalCreateExportReceipt(false)}
            className="w-full border py-2 rounded-md cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="submit"
            className="w-full bg-red-700 text-white rounded-md py-2 cursor-pointer"
          >
            {isLoading ? "Đang xử lý..." : "Xuất kho"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalCreateExportReceipt;
