import Product from "../../model/product.model.js";
import ProductCategory from "../../model/productCategory.model.js";
import Recipe from "../../model/recipe.model.js";
import Ingredient from "../../model/ingredient.model.js";
import Order from "../../model/order.model.js";
//  Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, productCategoryId, description, image, price, discount } =
      req.body;

    if (!name || !productCategoryId || !description || !image || price === "") {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }
    if (price < 0) {
      return res.status(400).json({ message: "Đơn giá nhỏ hơn 0" });
    }
    if (discount > 100) {
      return res.status(400).json({ message: "Giảm giá lớn hơn 100%" });
    }
    if (discount < 0) {
      return res.status(400).json({ message: "Giảm giá lớn nhỏ 0" });
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại" });
    }

    const product = new Product({
      name,
      productCategoryId,
      description,
      image,
      price,
      discount: discount || 0,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo sản phẩm thất bại" });
  }
};

// Lấy tối đa 10 sản phẩm mới nhất
export const getLimitedProducts = async (req, res) => {
  try {
    let products = await Product.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
    ]);

    products = await Product.populate(products, {
      path: "productCategoryId",
      select: "name",
    });

    products = await autoUpdateProductStatus(products);

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy sản phẩm giới hạn thất bại" });
  }
};

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find()
      .populate("productCategoryId", "name")
      .sort({ createdAt: -1 });

    products = await autoUpdateProductStatus(products);

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy tất cả sản phẩm thất bại" });
  }
};

//  Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (req, res) => {
  try {
    const { slugCategory } = req.params;
    if (!slugCategory) {
      return res.status(400).json({ message: "Thiếu slug danh mục" });
    }
    const productCategory = await ProductCategory.findOne({
      slug: slugCategory,
    });
    if (!productCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    const products = await Product.find({
      productCategoryId: productCategory._id,
    })
      .populate("productCategoryId", "name")
      .sort({ createdAt: -1 });

    const finalProducts = await autoUpdateProductStatus(products);

    res.json(finalProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy sản phẩm theo danh mục thất bại" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, productCategoryId, image, price, discount } =
      req.body;
    if (price < 0) {
      return res.status(404).json({ message: "Đơn giá không được nhỏ hơn 0" });
    }
    if (discount < 0) {
      return res
        .status(404)
        .json({ message: "Phần trăm giảm giá không được nhỏ hơn 0" });
    }
    if (discount > 100) {
      return res
        .status(404)
        .json({ message: "Phần trăm giảm giá không được lớn hơn 100" });
    }

    const existingProduct = await Product.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });

    if (existingProduct) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, productCategoryId, image, price, discount },
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật sản phẩm thất bại" });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    // Tắt sản phẩm -> cho tắt luôn
    if (status === false) {
      const product = await Product.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      return res.json(product);
    }

    // Bật sản phẩm -> kiểm tra công thức
    const recipe = await Recipe.findOne({ productId: id }).populate(
      "items.ingredientId"
    );

    if (!recipe) {
      return res.status(400).json({
        message: "Sản phẩm chưa có công thức",
      });
    }

    // Check nguyên liệu
    for (let item of recipe.items) {
      const ingredient = item.ingredientId;
      const requiredAmount = item.quantity;

      if (!ingredient) {
        return res.status(400).json({
          message: `Nguyên liệu không tồn tại`,
        });
      }

      if (!ingredient.status) {
        return res.status(400).json({
          message: `Nguyên liệu đang hết hàng: ${ingredient.name}`,
        });
      }

      if (ingredient.quantity < requiredAmount) {
        return res.status(400).json({
          message: `Nguyên liệu trong kho không đủ: ${ingredient.name}`,
        });
      }
    }

    // Đủ -> bật sản phẩm
    const product = await Product.findByIdAndUpdate(
      id,
      { status: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái sản phẩm thất bại" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await Recipe.exists({ productId: id });
    if (isUsed) {
      return res.status(400).json({
        message:
          "Không thể xóa sản phẩm này vì đang được sử dụng trong công thức",
      });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xóa sản phẩm thất bại" });
  }
};
export const getTopSellingProducts = async (req, res) => {
  try {
    let products = await Order.aggregate([
      // Unwind items array để tách từng sản phẩm
      { $unwind: "$items" },
      // Group theo productId và tính tổng số lượng
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      // Sắp xếp giảm dần theo số lượng bán
      { $sort: { totalSold: -1 } },
      // Lấy 4 sản phẩm đầu
      { $limit: 4 },
      // Join với collection products
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      // Merge data
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$product", { totalSold: "$totalSold" }]
          }
        }
      }
    ]);

    // Populate productCategoryId
    products = await Product.populate(products, {
      path: "productCategoryId",
      select: "name"
    });

    // Tự động cập nhật trạng thái sản phẩm
    products = await autoUpdateProductStatus(products);
    
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy sản phẩm bán chạy thất bại" });
  }
};
// update tự động
const autoUpdateProductStatus = async (products) => {
  // Lọc products đang bật
  const activeProducts = products.filter(p => p.status);
  
  if (activeProducts.length === 0) {
    return products;
  }

  const productIds = activeProducts.map(p => p._id);

  // Query ALL recipes của products đang bật 
  const recipes = await Recipe.find({ 
    productId: { $in: productIds } 
  }).lean();

  // Lấy ALL ingredient IDs từ recipes 
  const ingredientIds = new Set();
  recipes.forEach(recipe => {
    recipe.items.forEach(item => {
      ingredientIds.add(item.ingredientId.toString());
    });
  });

  // Query ALL ingredients một lần 
  const ingredients = await Ingredient.find({
    _id: { $in: Array.from(ingredientIds) }
  }).lean();

  // Map ingredients by ID để tra cứu
  const ingredientMap = new Map();
  ingredients.forEach(ing => {
    ingredientMap.set(ing._id.toString(), ing);
  });

  // Map recipes by productId
  const recipeMap = new Map();
  recipes.forEach(recipe => {
    recipeMap.set(recipe.productId.toString(), recipe);
  });

  // Check từng product
  const bulkOps = [];
  
  for (let product of products) {
    if (!product.status) continue;

    const recipe = recipeMap.get(product._id.toString());
    
    // Không có công thức -> tắt
    if (!recipe) {
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { status: false }
        }
      });
      product.status = false;
      continue;
    }

    let isValid = true;

    for (let item of recipe.items) {
      const ingredient = ingredientMap.get(item.ingredientId.toString());

      // Nguyên liệu không tồn tại / bị tắt / không đủ số lượng
      if (
        !ingredient ||
        !ingredient.status ||
        ingredient.quantity < item.quantity
      ) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { status: false }
        }
      });
      product.status = false;
    }
  }

  // Bulk update tất cả products cần tắt 
  if (bulkOps.length > 0) {
    await Product.bulkWrite(bulkOps);
  }

  return products;
};
