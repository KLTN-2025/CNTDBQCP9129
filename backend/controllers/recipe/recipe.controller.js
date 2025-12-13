import Recipe from "../../model/recipe.model.js";
// Tạo công thức mới
import Product from "../../model/product.model.js";
export const createRecipe = async (req, res) => {
  try {
    const { productId, items } = req.body;
    if (!productId || !items || items.length === 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const existingRecipe = await Recipe.findOne({ productId });
    if (existingRecipe) {
      return res
        .status(400)
        .json({ message: "Công thức cho món này đã tồn tại" });
    }

    if (items.some((item) => item.quantity < 1)) {
      return res.status(400).json({ message: "Số lượng không được nhỏ hơn 1" });
    }
    const ids = items.map((i) => i.ingredientId);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return toast.error("Công thức có chứa nguyên liệu trùng nhau!");
    }

    const newRecipe = new Recipe({ productId, items });
    const savedRecipe = await newRecipe.save();

    // Sau khi lưu, populate khóa phụ để trả chi tiết product/ingredient
    const populatedRecipe = await Recipe.findById(savedRecipe._id)
      .populate("productId", "name price")
      .populate("items.ingredientId", "name unit");

    res.status(201).json(populatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả công thức
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("productId", "name")
      .populate("items.ingredientId", "name");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy công thức theo ID
// export const getRecipeById = async (req, res) => {
//   try {
//     const recipe = await Recipe.findById(req.params.id)
//       .populate("productId", "name")
//       .populate("items.ingredientId", "name");

//     if (!recipe) return res.status(404).json({ message: "Không tìm thấy công thức" });

//     res.status(200).json(recipe);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Cập nhật công thức
export const updateRecipe = async (req, res) => {
  try {
    const { productId, items } = req.body;

    if (!productId || !items || items.length === 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }
    const existingRecipe = await Recipe.findOne({ 
      productId, 
      _id: { $ne: req.params.id }  // bỏ qua recipe đang update
    });
    
    if (existingRecipe) {
      return res
        .status(400)
        .json({ message: "Công thức cho món này đã tồn tại" });
    }
    if (items.some((item) => item.quantity < 1)) {
      return res.status(400).json({ message: "Số lượng không được nhỏ hơn 1" });
    }
    const ids = items.map((i) => i.ingredientId);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      return toast.error("Công thức có chứa nguyên liệu trùng nhau!");
    }

    // Cập nhật
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { productId, items },
      { new: true } // trả về document mới
    );

    if (!updatedRecipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    // Populate sau khi update
    const populatedRecipe = await Recipe.findById(updatedRecipe._id)
      .populate("productId", "name price")
      .populate("items.ingredientId", "name unit");

    res.status(200).json(populatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa công thức
export const deleteRecipe = async (req, res) => {
  try {
    // 1️⃣ Xóa công thức
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    // 2️⃣ Tắt sản phẩm liên quan
    await Product.findByIdAndUpdate(deletedRecipe.productId, { status: false });

    res.status(200).json({ message: "Xóa công thức thành công và sản phẩm đã hết hàng" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};