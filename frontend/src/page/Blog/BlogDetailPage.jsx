import React, { useEffect, useState } from "react";
import blogApi from "../../api/blogAPI";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDateVN } from "../../utils/formatDateVN";
import BlogsRelatedSection from "./BlogsRelatedSection";
const BlogDetailPage = () => {
  const { categorySlug, nameBlogSlug } = useParams();
  const [dataBlog, setDataBlog] = useState(null);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogApi.getBySlug(categorySlug, nameBlogSlug);
        setDataBlog(data);
      } catch {
        toast.error("Đã có lỗi xảy ra khi xem bài viết");
      }
    };
    fetchBlog();
  }, [categorySlug, nameBlogSlug]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu mượt
  }, [nameBlogSlug]);
  return (
    <div className="w-full flex flex-col bg-gradient-to-b bg-yellow-100 to-white items-center text-lg gap-y-10 p-4 select-none px-20 max-sm:px-4 pt-20">
      {dataBlog && (
        <>
          <div>
            <div className="flex items-center justify-around pb-14">
              <span className="font-bold text-blue-500">
                {dataBlog.categoryId.name}
              </span>
              <span className="font-medium text-gray-400">
                {formatDateVN(dataBlog.createdAt)}
              </span>
            </div>
            <h1 className="text-4xl text-center font-bold">{dataBlog.title}</h1>
          </div>
          <div className="flex flex-col w-full items-center">
            <img
              src={dataBlog.images[0]}
              className=" w-full object-contain object-center "
              alt="ảnh chính"
            />
            <div className="max-w-2xl flex flex-col gap-y-4 mt-2">
              {/*Mở bài*/}
              <div>
                <p className="font-medium text-yellow-500">
                  {dataBlog.content.intro.highlight}
                </p>
                <p>{dataBlog.content.intro.text}</p>
              </div>
              {/*Thân bài*/}
              <div className="gap-y-4">
                {dataBlog.images[1] && (
                  <img src={dataBlog.images[1]} alt="ảnh phụ" />
                )}
                <p className="font-medium text-yellow-500">
                  {dataBlog.content.body.highlight}
                </p>
                <p>{dataBlog.content.body.text}</p>
              </div>
              {/*Kết bài*/}

              <div>
                {dataBlog.images[2] && (
                  <img src={dataBlog.images[2]} alt="ảnh phụ" />
                )}
                <p className="font-medium text-yellow-500">
                  {dataBlog.content.conclusion.highlight}
                </p>
                <p>{dataBlog.content.conclusion.text}</p>
              </div>
            </div>
          </div>
          <BlogsRelatedSection dataBlogId={dataBlog._id} />
        </>
      )}
    </div>
  );
};

export default BlogDetailPage;
