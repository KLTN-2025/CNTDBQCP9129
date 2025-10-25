import Blog from '../../model/blog.model';

// Tạo blog mới
export const createBlog = async (req, res) => {
  try {
    const { title, categoryId, content } = req.body;

    // Lấy URL ảnh chính thức từ Cloudinary (HTTPS)
    const images = req.files?.map(file => file.secure_url) || [];

    // Kiểm tra dữ liệu bắt buộc
    if (!title || !categoryId || images.length === 0 || !content) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const blog = new Blog({
      title,
      categoryId,
      images,
      content,
    });

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
    const blogs = await Blog.find().populate("categoryId", "name").sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy blog thất bại" });
  }
};

// Lấy blog theo slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("categoryId", "name");
    if (!blog) return res.status(404).json({ message: "Không tìm thấy blog" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy blog thất bại" });
  }
};

// Cập nhật blog theo ID
export const updateBlog = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, categoryId },
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
