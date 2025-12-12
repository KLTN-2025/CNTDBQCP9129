import Ingredient from "../../model/ingredient.model.js";
import ImportReceipt from "../../model/receipt.model.js";

// Tạo phiếu nhập kho (có snapshot)
export const createImportReceipt = async (req, res) => {
  try {
    const { items, note, userId } = req.body;

    // Kiểm tra input
    if (!items || !Array.isArray(items) || items.length === 0 || !userId) {
      return res.status(400).json({ message: "Danh sách nguyên liệu không hợp lệ" });
    }

    const processedItems = [];

    for (let item of items) {
      if (!item.ingredientId || !item.quantity || item.totalCost == null) {
        return res.status(400).json({ message: "Thiếu dữ liệu trong từng nguyên liệu" });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: "Số lượng phải lớn hơn 0" });
      }

      if (item.totalCost < 0) {
        return res.status(400).json({ message: "Tổng tiền không được nhỏ hơn 0" });
      }

      // Lấy thông tin nguyên liệu hiện tại
      const ing = await Ingredient.findById(item.ingredientId);
      if (!ing) {
        return res.status(404).json({ message: "Nguyên liệu không tồn tại: " + item.ingredientId });
      }

      const pricePerUnit = item.totalCost / item.quantity;

      // Snapshot vào phiếu nhập
      processedItems.push({
        ingredientId: ing._id,
        ingredientName: ing.name, 
        unit: ing.unit,           
        quantity: item.quantity,
        totalCost: item.totalCost,
        pricePerUnit,
      });
    }

    // Lưu phiếu nhập (snapshot)
    let receipt = await ImportReceipt.create({
      items: processedItems,
      note: note || "",
      createdBy: userId,
    });

    // Cập nhật kho nguyên liệu
    for (let it of processedItems) {
      const ing = await Ingredient.findById(it.ingredientId);

      ing.quantity += Number(it.quantity);
      ing.totalCost += Number(it.totalCost);
      ing.lastPrice = Number(it.pricePerUnit);

      await ing.save();
    }
    receipt = await receipt.populate("createdBy", "name email");
    res.status(201).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy danh sách phiếu nhập
export const getImportReceipts = async (req, res) => {
  try {
    const receipts = await ImportReceipt.find()
      .populate("createdBy", "name email role") // chỉ populate user
      .sort({ createdAt: -1 });

    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy 1 phiếu nhập chi tiết
export const getImportReceiptById = async (req, res) => {
  try {
    const receipt = await ImportReceipt.findById(req.params.id)
      .populate("createdBy", "name email role");

    if (!receipt) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
