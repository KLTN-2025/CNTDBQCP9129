import Product from "../../model/product.model.js";
import ProductCategory from "../../model/productCategory.model.js";

//  Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, productCategoryId, description, image, price, discount } = req.body;

    if (!name || !productCategoryId || !description || !image || !price) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
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

//  Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (req, res) => {
  try {
    const { slugCategory } = req.params;
    console.log(slugCategory)

    if (!slugCategory) {
      return res.status(400).json({ message: "Thiếu slug danh mục" });
    }
 
    const productCategory = await ProductCategory.findOne({ slug: slugCategory });
    console.log(productCategory)
    if (!productCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    const products = await Product.find({ productCategoryId: productCategory._id })
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
    const { name, description, productCategoryId, image, price, discount } = req.body;

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

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xóa sản phẩm thất bại" });
  }
};
