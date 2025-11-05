import Ingredient from "../../model/ingredient.model.js";

// Lấy tất cả nguyên liệu trong kho
export const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ createdAt: -1 });
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm nguyên liệu mới
export const createIngredient = async (req, res) => {
  try {
    const { name, quantity, unit, totalCost } = req.body;

    // Kiểm tra đủ dữ liệu
    if (!name || quantity == null || !unit || totalCost == null) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc"});
    }
    if(quantity < 0){
      return res.status(400).json({ message: "Số lượng không được nhỏ hơn 0"});
    }

    if(totalCost < 0){
      return res.status(400).json({ message: "Tổng tiền không được nhỏ hơn 0"});
    }

    // Tính perUnitCost tự động
    const perUnitCost = totalCost / quantity;

    const existing = await Ingredient.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Nguyên liệu đã tồn tại" });

    const newIngredient = new Ingredient({
      name,
      quantity,
      unit,
      totalCost,
      perUnitCost,
      status: true // mặc định còn hàng
    });

    await newIngredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Sửa nguyên liệu
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit, totalCost } = req.body;

    // Kiểm tra đủ dữ liệu
    if (!name || quantity == null || !unit || totalCost == null) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }
    if (quantity < 0) {
      return res.status(400).json({ message: "Số lượng không được nhỏ hơn 0" });
    }
    if (totalCost < 0) {
      return res.status(400).json({ message: "Tổng tiền không được nhỏ hơn 0" });
    }

    // Check tên trùng với ingredient khác
    const existingIngredient = await Ingredient.findOne({
      name: name.trim(),
      _id: { $ne: id } // bỏ qua chính ingredient này
    });

    if (existingIngredient) {
      return res.status(400).json({ message: "Tên nguyên liệu đã tồn tại" });
    }

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    }

    // Update dữ liệu
    ingredient.name = name.trim();
    ingredient.quantity = quantity;
    ingredient.unit = unit;
    ingredient.totalCost = totalCost;
    ingredient.perUnitCost = totalCost / quantity;

    await ingredient.save();

    res.status(200).json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xóa nguyên liệu
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Ingredient.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
