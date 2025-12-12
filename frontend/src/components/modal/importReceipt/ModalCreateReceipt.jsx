import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import ingredientApi from "../../../api/ingredientApi";
import importReceiptApi from "../../../api/importReceiptApi";
import useAuthStore from "../../../store/authStore";
import { IoIosRemoveCircle } from "react-icons/io";

const ModalCreateReceipt = ({
  isOpenModalCreateReceipt,
  setIsOpenModalCreateReceipt,
  setReceipts,
}) => {
  useLockBodyScroll(isOpenModalCreateReceipt);

  const [ingredients, setIngredients] = useState([]);
  const [items, setItems] = useState([
    { ingredientId: "", quantity: "", totalCost: "" },
  ]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  // Lấy danh sách nguyên liệu khi mở modal
  useEffect(() => {
    if (isOpenModalCreateReceipt) {
      fetchIngredients();
    }
  }, [isOpenModalCreateReceipt]);

  const fetchIngredients = async () => {
    try {
      const data = await ingredientApi.getAll();
      setIngredients(data);
    } catch (error) {
      toast.error("Lỗi tải danh sách nguyên liệu");
    }
  };

  // Lọc danh sách nguyên liệu khả dụng cho mỗi dropdown
  const getAvailableIngredients = (currentIndex) => {
    const selectedIds = items
      .map((item, idx) => (idx !== currentIndex ? item.ingredientId : null))
      .filter(Boolean);
    
    return ingredients.filter((ing) => !selectedIds.includes(ing._id));
  };

  const handleChangeItem = (index, field, value) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index][field] = value;
      return newItems;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { ingredientId: "", quantity: "", totalCost: "" },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // Validate
    for (let it of items) {
      if (!it.ingredientId || !it.quantity || !it.totalCost) {
        toast.error("Vui lòng nhập đầy đủ từng nguyên liệu");
        return;
      }
      if (it.quantity <= 0) {
        toast.error("Số lượng phải lớn hơn 0");
        return;
      }
      if (it.totalCost < 0) {
        toast.error("Tổng tiền không được nhỏ hơn 0");
        return;
      }
    }

    try {
      setIsLoading(true);
      const itemsWithSnapshot = items.map((item) => {
        return {
          ingredientId: item.ingredientId,
          quantity: Number(item.quantity),
          totalCost: Number(item.totalCost),
          pricePerUnit: Number(item.totalCost) / Number(item.quantity),
        };
      });

      const response = await importReceiptApi.create({
        items: itemsWithSnapshot,
        note: note.trim(),
        userId: user.id,
      });

      if (response?._id) {
        toast.success("Tạo phiếu nhập thành công!");
        setReceipts((prev) => [response, ...prev]);
        setIsOpenModalCreateReceipt(false);
      } else {
        toast.error(response.message || "Lỗi tạo phiếu nhập");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Lỗi khi tạo phiếu nhập");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateReceipt}
      onRequestClose={() => setIsOpenModalCreateReceipt(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "2rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          overflow: "auto",
          border: "none",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "550px",
        },
      }}
    >
      <div className="bg-white rounded-md w-full flex flex-col select-none">
        {/* Header */}
        <div className="w-full bg-green-700 text-white py-3 px-4">
          <p className="font-bold text-lg">Tạo phiếu nhập kho</p>
        </div>

        <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
          {/* ITEMS */}
          <p className="font-semibold">Danh sách nguyên liệu *</p>

          {items.map((item, idx) => {
            const availableIngredients = getAvailableIngredients(idx);
            
            return (
              <div key={idx} className="border rounded-lg p-3 space-y-3 relative">
                {/* Remove row */}
                {items.length > 1 && (
                  <button
                    className="absolute top-2 right-2 text-red-700 cursor-pointer"
                    onClick={() => removeItemRow(idx)}
                  >
                    <IoIosRemoveCircle className="text-xl" />
                  </button>
                )}

                {/* Chọn nguyên liệu */}
                <div>
                  <label className="font-medium">Nguyên liệu</label>
                  <select
                    value={item.ingredientId}
                    onChange={(e) =>
                      handleChangeItem(idx, "ingredientId", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {availableIngredients.map((ing) => (
                      <option key={ing._id} value={ing._id}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Số lượng */}
                <div>
                  <label className="font-medium">Số lượng nhập *</label>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleChangeItem(idx, "quantity", val);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                {/* Tổng tiền */}
                <div>
                  <label className="font-medium">Tổng tiền *</label>
                  <input
                    type="text"
                    value={item.totalCost}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleChangeItem(idx, "totalCost", val);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            );
          })}

          <button
            className="w-full border border-green-700 text-green-700 py-2 rounded-md"
            onClick={addItemRow}
          >
            + Thêm nguyên liệu
          </button>

          {/* Ghi chú */}
          <div>
            <label className="font-medium">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              placeholder="Ví dụ: Nhập hàng sáng..."
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 py-4 border-t">
          <button
            className="w-full border px-4 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateReceipt(false)}
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
                alt="loading"
              />
            ) : (
              <p>Tạo phiếu</p>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateReceipt;