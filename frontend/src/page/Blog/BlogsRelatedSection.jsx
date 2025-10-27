import { useEffect, useState } from "react";
import blogApi from "../../api/blogAPI";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CarouselBlogRelated from "../../components/carousel/CarouselBlogRelated";
const BlogsRelatedSection = ({dataBlogId,}) => {
  const [dataBlogRelated, setDataBlogRelated] = useState([]);
  const { categorySlug } = useParams();
  useEffect(() => {
    const fetchBlogBySlug = async () => {
      try {
        const data = await blogApi.getByCategory(categorySlug);
        setDataBlogRelated(data.filter((blog) => blog._id !== dataBlogId));
      } catch {
        toast.error("Đã có lỗi xảy ra khi hiển thị bài viết liên quan");
      }
    };
    fetchBlogBySlug();
  }, []);
  return (
    <>
      <h2 className="font-bold text-2xl pt-14">BÀI VIẾT LIÊN QUAN</h2>
      <CarouselBlogRelated dataBlogRelated={dataBlogRelated} categorySlug={categorySlug}/>
    </>
  );
};

export default BlogsRelatedSection;
