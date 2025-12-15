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
    document.title = dataBlog?.title || "Đang tải bài viết...";
  }, [dataBlog]);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [nameBlogSlug]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-yellow-50 via-white to-gray-50">
      {dataBlog && (
        <>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            {/* Header Section */}
            <article className="space-y-8">
              {/* Meta Info */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {dataBlog.categoryId.name}
                </span>
                <span className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDateVN(dataBlog.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center leading-tight px-4">
                {dataBlog.title}
              </h1>

              {/* Featured Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={dataBlog.images[0]}
                  className="w-full h-auto object-cover"
                  alt="Ảnh bài viết chính"
                />
              </div>

              {/* Content Section */}
              <div className="prose prose-lg max-w-none space-y-8 mt-12">
                {/* Intro */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  {dataBlog.content.intro.highlight && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-1 h-6 bg-yellow-500 rounded-full"></div>
                      <p className="text-xl font-semibold text-yellow-600 leading-relaxed">
                        {dataBlog.content.intro.highlight}
                      </p>
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {dataBlog.content.intro.text}
                  </p>
                </div>

                {/* Body */}
                <div className="space-y-6">
                  {dataBlog.images[1] && (
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img 
                        src={dataBlog.images[1]} 
                        alt="Ảnh minh họa" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    {dataBlog.content.body.highlight && (
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-1 h-6 bg-yellow-500 rounded-full"></div>
                        <p className="text-xl font-semibold text-yellow-600 leading-relaxed">
                          {dataBlog.content.body.highlight}
                        </p>
                      </div>
                    )}
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {dataBlog.content.body.text}
                    </p>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="space-y-6">
                  {dataBlog.images[2] && (
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img 
                        src={dataBlog.images[2]} 
                        alt="Ảnh kết luận" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                  <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-8 shadow-sm border border-yellow-100">
                    {dataBlog.content.conclusion.highlight && (
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-1 h-6 bg-yellow-500 rounded-full"></div>
                        <p className="text-xl font-semibold text-yellow-600 leading-relaxed">
                          {dataBlog.content.conclusion.highlight}
                        </p>
                      </div>
                    )}
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {dataBlog.content.conclusion.text}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Related Blogs Section - Full Width */}
          <div className="w-full mt-16 pt-12 border-t border-gray-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <BlogsRelatedSection dataBlogId={dataBlog._id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogDetailPage;