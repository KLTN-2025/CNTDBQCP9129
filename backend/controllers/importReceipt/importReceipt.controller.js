import Ingredient from "../../model/ingredient.model.js";
import ImportReceipt from "../../model/receipt.model.js";
// Tạo phiếu nhập kho
export const createImportReceipt = async (req, res) => {
  try {
    const { items, note, userId } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!items || !Array.isArray(items) || items.length === 0 || !userId) {
      return res.status(400).json({ message: "Danh sách nguyên liệu không hợp lệ" });
    }
    console.log(userId);
    // Tính pricePerUnit cho từng item
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

      const ing = await Ingredient.findById(item.ingredientId);
      if (!ing) {
        return res.status(404).json({ message: "Nguyên liệu không tồn tại: " + item.ingredientId });
      }

      const pricePerUnit = item.totalCost / item.quantity;

      processedItems.push({
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        totalCost: item.totalCost,
        pricePerUnit,
      });
    }

    // Lưu phiếu nhập
    const receipt = await ImportReceipt.create({
      items: processedItems,
      note: note || "",
      createdBy: userId
    });

    // Cập nhật kho (quantity + totalCost + perUnitCost = giá gần nhất)
    for (let it of processedItems) {
      const ing = await Ingredient.findById(it.ingredientId);

      // Cộng thêm vào kho
      ing.quantity += Number(it.quantity);

      // Tổng tiền mới = tổng tiền cũ + tổng tiền nhập
      ing.totalCost += Number(it.totalCost);

      // Giá gần nhất (giá trên 1 đơn vị mới)
      ing.lastPrice = Number(it.pricePerUnit);

      await ing.save();
    }

    res.status(201).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy danh sách phiếu nhập kho
export const getImportReceipts = async (req, res) => {
  try {
    const receipts = await ImportReceipt.find()
      .populate("items.ingredientId", "name unit")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy chi tiết 1 phiếu nhập
export const getImportReceiptById = async (req, res) => {
  try {
    const receipt = await ImportReceipt.findById(req.params.id)
      .populate("items.ingredientId", "name unit");

    if (!receipt) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
