import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import BlogCard from "../BlogCard";

export default function CarouselBlogRelated({ dataBlogRelated, categorySlug }) {
  return (
    <div className="relative w-full mt-8 px-10">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        spaceBetween={20}
        slidesPerView={4}
        slidesPerGroup={1} // mỗi lần click chỉ trượt 1
        slidesPerGroupSkip={0} // không bỏ qua slide nào
        watchSlidesProgress={true} // giúp điều khiển mượt
        loop={false}
        slideToClickedSlide={false}
        centeredSlides={false}
        className="w-full"
        breakpoints={{
          1280: { slidesPerView: 4, slidesPerGroup: 1 },
          1024: { slidesPerView: 3, slidesPerGroup: 1 },
          768: { slidesPerView: 2, slidesPerGroup: 1 },
          480: { slidesPerView: 1, slidesPerGroup: 1 },
        }}
      >
        {dataBlogRelated.map((blog, index) => (
          <SwiperSlide key={blog._id || index}>
            <BlogCard blog={blog} categorySlug={categorySlug}/>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng custom */}
      <button className="swiper-button-prev-custom cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-800 shadow-md">
        <FaChevronLeft />
      </button>

      <button className="swiper-button-next-custom absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-800 shadow-md">
        <FaChevronRight />
      </button>
    </div>
  );
}
