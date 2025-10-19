import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules"; 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Carousel({ img1, img2, img3 }) {
  console.log(img1)
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]} // khai báo module
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      navigation={true} 
      pagination={{ clickable: true }} 
      className="w-full h-full rounded-xl"
    >
      <SwiperSlide>
        <img src={img1} className="w-full h-full object-cover" alt="Coffee 1" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={img2} className="w-full h-full object-cover" alt="Coffee 2" />
      </SwiperSlide>

      <SwiperSlide>
        <img src={img3} className="w-full h-full object-cover" alt="Coffee 3" />
      </SwiperSlide>
    </Swiper>
  );
}
