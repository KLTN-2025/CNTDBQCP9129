import Blog from "../../model/blog.model.js";
import BlogCategory from "../../model/blogCategory.model.js"
// Tạo blog mới
export const createBlog = async (req, res) => {
  try {
    const { title, categoryId, content, images } = req.body;

    if (!title || !categoryId || !content || !images?.length) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ message: "Tiêu đề blog đã tồn tại" });
    }
    const blog = new Blog({ title, categoryId, content, images });
    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo blog thất bại" });
  }
};


// Lấy tất cả blog
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy blog thất bại" });
  }
};
// Lấy 6 blog ngẫu nhiên
export const getRandomBlogs = async (req, res) => {
  try {
    const blogs = await Blog.aggregate([{ $sample: { size: 6 } }]);

    const blogsWithCategory = await Blog.populate(blogs, {
      path: "categoryId",
      select: "slug"
    });

    res.status(200).json(blogsWithCategory);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy blog ngẫu nhiên", error });
  }
};
// Lấy blog theo slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slugCategory, slug } = req.params;

    // Tìm category theo slugCategory
    const category = await BlogCategory.findOne({ slug: slugCategory });
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Tìm blog theo slug và categoryId
    const blog = await Blog.findOne({ slug, categoryId: category._id }).populate(
      "categoryId",
      "name"
    );

    if (!blog) {
      return res.status(404).json({ message: "Không tìm thấy blog" });
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy blog thất bại" });
  }
};
// lấy blog theo danh mục
export const getBlogsByCategory = async (req, res) => {
  try {
    const { slugCategory } = req.params; 
    console.log(slugCategory);
    if (!slugCategory) {
      return res.status(400).json({ message: "Thiếu slug danh mục" });
    }

    // Tìm category theo slug
    const category = await BlogCategory.findOne({ slug: slugCategory });
    console.log(category);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Lấy blog theo categoryId
    const blogs = await Blog.find({ categoryId: category._id })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy blog theo danh mục thất bại" });
  }
};
// Cập nhật blog theo ID
export const updateBlog = async (req, res) => {
  try {
    const { title, content, categoryId, images } = req.body; 

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, categoryId, images }, 
      { new: true, runValidators: true }
    );

    if (!blog) return res.status(404).json({ message: "Không tìm thấy blog" });

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật blog thất bại" });
  }
};

// Xóa blog theo ID
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Không tìm thấy blog" });
    res.json({ message: "Xóa blog thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xóa blog thất bại" });
  }
};
