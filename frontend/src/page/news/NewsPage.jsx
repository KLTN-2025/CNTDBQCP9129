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
        toast.error(error.response.data.message);
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
    <div className="min-h-screen w-full bg-gradient-to-b from-yellow-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-y-6 pb-16 relative">
          <div className="absolute top-[36%] right-[10%] z-[20] max-lg:hidden">
            <Parallax speed={10}>
              <img
                src="/sticker.png"
                alt="sticker"
                className="w-24 opacity-80"
              />
            </Parallax>
          </div>
          
          <h1 className="text-center text-4xl lg:text-5xl font-bold text-gray-900 max-w-3xl">
            {currentCategory ? currentCategory.name : categorySlug}
          </h1>
          
          <p className="text-center max-w-2xl text-base lg:text-lg text-gray-600 leading-relaxed px-4">
            "Tin tức nhà COFFEEGO" là nơi nhà chia sẻ những câu chuyện đằng sau
            mỗi ly nước bạn cầm trên tay. Từ hành trình tìm kiếm nguyên liệu,
            những vùng đất cà phê xa xôi, cho đến cách chúng tôi gìn giữ hương vị
            nguyên bản và lan tỏa những giá trị ý nghĩa.
          </p>
          
          <div className="flex flex-wrap gap-3 items-center justify-center mt-4">
            {blogcategories &&
              blogcategories.length > 0 &&
              blogcategories.map((category) => (
                <Link key={category._id} to={`/blogs/${category.slug}`}>
                  <button
                    className={`${
                      categorySlug === category.slug
                        ? "bg-amber-600 text-white shadow-lg scale-105"
                        : "text-amber-600 bg-white hover:bg-amber-50"
                    } rounded-full px-6 py-2.5 border border-amber-600 cursor-pointer font-semibold transition-all duration-200 hover:shadow-md`}
                  >
                    {category.name}
                  </button>
                </Link>
              ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto -ml-8"
          columnClassName="pl-8 bg-clip-padding"
        >
          {blogs &&
            blogs.length > 0 &&
            blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1 
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="mb-8"
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
    </div>
  );
};

export default NewsPage;