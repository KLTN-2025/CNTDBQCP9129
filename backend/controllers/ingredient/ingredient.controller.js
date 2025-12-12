import Ingredient from "../../model/ingredient.model.js";
import Recipe from "../../model/recipe.model.js";
import Product from "../../model/product.model.js"
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
    const { name, quantity, unit, lastPrice } = req.body;

    if (!name || quantity == null || !unit || lastPrice == null) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Số lượng không được nhỏ hơn 0" });
    }

    if (lastPrice < 0) {
      return res.status(400).json({ message: "Giá gần nhất không được nhỏ hơn 0" });
    }

    const existing = await Ingredient.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Nguyên liệu đã tồn tại" });
    }

    const newIngredient = new Ingredient({
      name: name.trim(),
      quantity,
      unit,
      lastPrice,
      status: true
    });

    await newIngredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Cập nhập trạng thái nguyên liệu trong kho
export const toggleIngredientStatus = async (req, res) => {
  try {
    const { id } = req.params; // id nguyên liệu
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });

    const newStatus = !ingredient.status;

    // Cập nhật trạng thái nguyên liệu
    await Ingredient.findByIdAndUpdate(id, { status: newStatus });

    // Tìm tất cả công thức có chứa nguyên liệu này
    const recipes = await Recipe.find({ "items.ingredientId": id });
    const productIds = recipes.map(r => r.productId);

    // Cập nhật trạng thái món nước liên quan
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status: newStatus } }
    );

    res.json({ message: "Cập nhật trạng thái thành công", newStatus });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Sửa nguyên liệu
export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit } = req.body;

    // Kiểm tra dữ liệu
    if (!name || !unit) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc (name, unit)" });
    }

    // Check tên trùng với nguyên liệu khác
    const existingIngredient = await Ingredient.findOne({
      name: name.trim(),
      _id: { $ne: id }
    });

    if (existingIngredient) {
      return res.status(400).json({ message: "Tên nguyên liệu đã tồn tại" });
    }

    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });
    }

    // Chỉ cho phép update name, unit
    ingredient.name = name.trim();
    ingredient.unit = unit;

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
    const isUsed = await Recipe.exists({ "items.ingredientId": id });
    if (isUsed) {
      return res.status(400).json({
        message: "Không thể xóa nguyên liệu này vì đang được sử dụng trong công thức",
      });
    }

    const deleted = await Ingredient.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy nguyên liệu" });

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
