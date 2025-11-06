import Product from "../../model/product.model.js";
import ProductCategory from "../../model/productCategory.model.js";
import Recipe from "../../model/recipe.model.js"
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
      discount: discount || 0, // mặc định 0%
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
    const products = await Product.aggregate([
      { $sample: { size: 10 } }, // Lấy ngẫu nhiên 10 sản phẩm
    ]);

    // Nếu muốn populate categoryId
    const productsWithCategory = await Product.populate(products, {
      path: "productCategoryId",
      select: "name",
    });

    res.status(200).json(productsWithCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy sản phẩm giới hạn thất bại" });
  }
};
// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("productCategoryId", "name") // lấy tên danh mục
      .sort({ createdAt: -1 }); // sản phẩm mới nhất lên đầu

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
    console.log(slugCategory);

    if (!slugCategory) {
      return res.status(400).json({ message: "Thiếu slug danh mục" });
    }

    const productCategory = await ProductCategory.findOne({
      slug: slugCategory,
    });
    console.log(productCategory);
    if (!productCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const products = await Product.find({
      productCategoryId: productCategory._id,
    })
      .populate("productCategoryId", "name")
      .sort({ createdAt: -1 });

    res.json(products);
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
      _id: { $ne: req.params.id }, // bỏ qua product hiện tại
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

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem sản phẩm có đang được dùng trong công thức không
    const isUsed = await Recipe.exists({ productId: id });
    if (isUsed) {
      return res.status(400).json({
        message: "Không thể xóa sản phẩm này vì đang được sử dụng trong công thức",
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