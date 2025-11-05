import slugify from "slugify";
import ProductCategory from "../../model/productCategory.model.js";
import Product from '../../model/product.model.js'

// Lấy tất cả loại sản phẩm
export const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm loại sản phẩm mới
export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const existing = await ProductCategory.findOne({ slug });
    if (existing)
      return res.status(400).json({ message: "Loại sản phẩm đã tồn tại" });
    const newCategory = new ProductCategory({ name, image });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Sửa loại sản phẩm 
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    // Kiểm tra category tồn tại
    const category = await ProductCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });

    // Kiểm tra tên trùng với category khác
    const existingCategory = await ProductCategory.findOne({
      name: name.trim(),
      _id: { $ne: id } // bỏ qua category hiện tại
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Tên loại sản phẩm đã tồn tại" });
    }

    // Cập nhật
    category.name = name.trim();
    category.image = image;
    await category.save(); // middleware pre('save') vẫn chạy => slug tạo lại

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xóa loại  sản phẩm
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCount = await Product.countDocuments({ productCategoryId: id });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Không thể xóa loại sản phẩm vì đang chứa ${productCount} sản phẩm.`,
      });
    }

    const deleted = await ProductCategory.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
