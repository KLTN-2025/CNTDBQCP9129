import Recipe from "../../model/recipe.model.js";
// Tạo công thức mới
export const createRecipe = async (req, res) => {
  try {
    const { productId, items } = req.body;
    if (!productId || !items || items.length === 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }
    const existingRecipe = await Recipe.findOne({ productId });
    if (existingRecipe) {
      return res.status(400).json({ message: "Công thức cho món này đã tồn tại" });
    }
    if (items.some((item) => item.quantity < 0)) {
      return res.status(400).json({ message: "Số lượng không được nhỏ hơn 0" });
    }
    const newRecipe = new Recipe({ productId, items });
    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);
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

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { productId, items },
      { new: true }
    );

    if (!updatedRecipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa công thức
export const deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!deletedRecipe)
      return res.status(404).json({ message: "Không tìm thấy công thức" });

    res.status(200).json({ message: "Xóa công thức thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
