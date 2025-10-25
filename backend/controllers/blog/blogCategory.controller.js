import slugify from "slugify";
import BlogCategory from "../../model/blogCategory.model.js";

// Lấy tất cả category
export const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm category mới
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await BlogCategory.findOne({ slug });
    if (existing)
      return res.status(400).json({ message: "danh mục đã tồn tại" });

    const newCategory = new BlogCategory({ name });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Sửa category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await BlogCategory.findById(id);
    if (!category)
      return res.status(404).json({ message: "Không tìm thấy danh mục" });

    category.name = name; // thay đổi name
    await category.save(); // save lại => middleware pre('save') chạy => slug được tạo lại

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xóa category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BlogCategory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
