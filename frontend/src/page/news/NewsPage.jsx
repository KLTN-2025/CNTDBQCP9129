import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Masonry from "react-masonry-css";
import blogCategoryApi from "../../api/blogCategoryApi";
import { toast } from "react-toastify";
import blogApi from "../../api/blogAPI";
import { motion } from "framer-motion";
import BlogCard from "../../components/BlogCard";
import { Parallax } from "react-scroll-parallax";

const NewsPage = () => {
  const { categorySlug } = useParams();
  const [blogcategories, setBlogCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const fetchAllCategoryBlog = async () => {
      try {
        const data = await blogCategoryApi.getAll();
        setBlogCategories(data);
      } catch (error) {
        console.log(error);
        toast.error("Đã có lỗi xảy ra khi hiển thị danh mục");
      }
    };
    fetchAllCategoryBlog();
  }, []);
  useEffect(() => {
    const fetchBlogsByCategorySlug = async () => {
      try {
        const data = await blogApi.getByCategory(categorySlug);
        setBlogs(data);
      } catch {
        toast.error("Đã có lỗi xảy ra khi hiển thị bài viết");
      }
    };
    fetchBlogsByCategorySlug();
  }, [categorySlug]);
  const currentCategory = blogcategories.find(
    (category) => category.slug === categorySlug
  );
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <div className="mx-auto px-20 max-sm:px-4 pt-10 flex flex-col w-full bg-gradient-to-b bg-yellow-100 to-white ">
      <div className="flex flex-col items-center gap-y-4 pb-20 relative">
        <div className="absolute top-[36%] right-[16%] z-[20] max-lg:hidden">
          <Parallax speed={10}>
            <img
              src="/sticker.png"
              alt="sticker"
              className="w-24 max-md:w-16"
            />
          </Parallax>
        </div>
        <h1 className="text-center text-4xl font-bold">
          {currentCategory ? currentCategory.name : categorySlug}
        </h1>
        <p className="text-center max-w-2xl text-md">
          “Tin tức nhà COFFEEGO” là nơi nhà chia sẻ những câu chuyện đằng sau
          mỗi ly nước bạn cầm trên tay. Từ hành trình tìm kiếm nguyên liệu,
          những vùng đất cà phê xa xôi, cho đến cách chúng tôi gìn giữ hương vị
          nguyên bản và lan tỏa những giá trị ý nghĩa.
        </p>
        <div className="flex gap-x-4 items-center">
          {blogcategories &&
            blogcategories.length > 0 &&
            blogcategories.map((category) => (
              <Link to={`/blogs/${category.slug}`}>
                <button
                  className={`${
                    categorySlug === category.slug
                      ? "bg-amber-600 text-white"
                      : "text-amber-600 bg-white"
                  } rounded-full px-6 py-2 border-1 border-amber-600 cursor-pointer font-semibold`}
                >
                  {category.name}
                </button>
              </Link>
            ))}
        </div>
      </div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {blogs &&
          blogs.length > 0 &&
          blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: -20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className="blog-card"
            >
              <BlogCard
                blog={blog}
                fromNewsPage={true}
                categorySlug={categorySlug}
              />
            </motion.div>
          ))}
      </Masonry>
    </div>
  );
};

export default NewsPage;
