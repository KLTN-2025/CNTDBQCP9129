import React from "react";
import { Link } from "react-router-dom";
const BlogCard = ({ blog }) => {
  console.log('blog', blog.images[0])
  return (
    <div className="relative flex w-full flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative mx-4 -mt-6 h-50 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
        <img
          src={blog.images[0]}
          alt="hình ảnh mô tả câu chuyện"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6">
        <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug max-w-xs truncate tracking-normal text-blue-gray-900 antialiased">
          {blog.title}
        </h5>
        <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased line-clamp-3">
          {blog.content.intro.text}
        </p>
      </div>
      <div className="p-6 pt-0">
        <Link to={`/blogs/${blog.categoryId.slug}/${blog.slug}`}>
          <button className="learn-more btn-read-more">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Đọc thêm</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
