import Ingredient from "../../model/ingredient.model.js";
import ImportReceipt from "../../model/receipt.model.js";

// Tạo phiếu nhập kho (có snapshot)
export const createImportReceipt = async (req, res) => {
  try {
    const { items, note, userId } = req.body;

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

      const ing = await Ingredient.findById(item.ingredientId);
      if (!ing) {
        return res.status(404).json({ message: "Nguyên liệu không tồn tại: " + item.ingredientId });
      }

      const pricePerUnit = item.totalCost / item.quantity;

      processedItems.push({
        ingredientId: ing._id,
        ingredientName: ing.name,
        unit: ing.unit,
        quantity: item.quantity,
        totalCost: item.totalCost,
        pricePerUnit,
      });
    }

    let receipt = await ImportReceipt.create({
      type: "IMPORT",
      items: processedItems,
      note: note || "",
      createdBy: userId,
    });

    for (let it of processedItems) {
      const ing = await Ingredient.findById(it.ingredientId);

      ing.quantity += Number(it.quantity);
      ing.totalCost += Number(it.totalCost);
      ing.lastPrice = Number(it.pricePerUnit);
      ing.status = true;
      await ing.save();
    }
    
    receipt = await receipt.populate("createdBy", "name email");
    res.status(201).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Tạo phiếu xuất kho
export const createExportReceipt = async (req, res) => {
  try {
    const { items, note, userId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !userId) {
      return res.status(400).json({ message: "Danh sách nguyên liệu không hợp lệ" });
    }

    const processedItems = [];

    for (let item of items) {
      if (!item.ingredientId || !item.quantity) {
        return res.status(400).json({ message: "Thiếu dữ liệu trong từng nguyên liệu" });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: "Số lượng xuất phải lớn hơn 0" });
      }

      const ing = await Ingredient.findById(item.ingredientId);
      if (!ing) {
        return res.status(404).json({ message: "Nguyên liệu không tồn tại: " + item.ingredientId });
      }

      if (ing.quantity < item.quantity) {
        return res.status(400).json({
          message: `Số lượng xuất đã vượt quá số lượng hiện có`,
        });
      }

      processedItems.push({
        ingredientId: ing._id,
        ingredientName: ing.name,
        unit: ing.unit,
        quantity: item.quantity,
        pricePerUnit: ing.lastPrice || 0,
        totalCost: (ing.lastPrice || 0) * item.quantity,
      });
    }

    let receipt = await ImportReceipt.create({
      type: "EXPORT",
      items: processedItems,
      note: note || "",
      createdBy: userId,
    });

    for (let it of processedItems) {
      const ing = await Ingredient.findById(it.ingredientId);

      ing.quantity = Math.max(0, ing.quantity - Number(it.quantity));
      ing.totalCost = Math.max(0, ing.totalCost - Number(it.totalCost));

      if (ing.quantity === 0) {
        ing.status = false;
        ing.totalCost = 0;
        ing.lastPrice = 0;
      }
      await ing.save();
    }

    receipt = await receipt.populate("createdBy", "name email");

    res.status(201).json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getImportReceipts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      dateFilter.createdAt = {
        $gte: start,
        $lte: end
      };
    } else {
      // MẶC ĐỊNH: Chỉ lấy phiếu HÔM NAY
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      dateFilter.createdAt = {
        $gte: today,
        $lt: tomorrow
      };
    }

    const receipts = await ImportReceipt.find(dateFilter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    const total = receipts.length;

    res.json({
      receipts,
      total,
      dateRange: {
        start: startDate || new Date().toISOString().split('T')[0],
        end: endDate || new Date().toISOString().split('T')[0]
      }
    });
  } catch (err) {
    console.error("GET RECEIPTS ERROR:", err);
    res.status(500).json({ message: "Lấy danh sách phiếu thất bại" });
  }
};

// Lấy 1 phiếu nhập chi tiết
export const getImportReceiptById = async (req, res) => {
  try {
    const receipt = await ImportReceipt.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!receipt) {
      return res.status(404).json({ message: "Không tìm thấy phiếu nhập" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};