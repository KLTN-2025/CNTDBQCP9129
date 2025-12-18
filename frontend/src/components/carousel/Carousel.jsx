import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectCreative,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

export default function Carousel({images}) {
  const [activeIndex, setActiveIndex] = useState(0);

 

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectCreative]}
            effect="creative"
            creativeEffect={{
              prev: {
                translate: ["-120%", 0, -500],
                rotate: [0, 0, -15],
                opacity: 0,
              },
              next: {
                translate: ["120%", 0, -500],
                rotate: [0, 0, 15],
                opacity: 0,
              },
            }}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-custom",
              bulletClass: "swiper-pagination-bullet-custom",
              bulletActiveClass: "swiper-pagination-bullet-active-custom",
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="travel-slider"
          >
            {images.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full h-full">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transform transition-transform duration-[8000ms] hover:scale-110"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 max-md:w-8 max-md:h-8 rounded-full cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 group">
            <svg
              className="w-6 h-6 max-md:h-5 max-md:w-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button className="swiper-button-next-custom absolute right-6 max-md:w-8 max-md:h-8 top-1/2 -translate-y-1/2 z-30 w- cursor-pointer w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 group">
            <svg
              className="w-6 h-6 max-md:h-5 max-md:w-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3"></div>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active-custom {
          width: 40px;
          height: 12px;
          border-radius: 6px;
          background: white;
        }

        .swiper-button-prev-custom:active,
        .swiper-button-next-custom:active {
          transform: translateY(-50%) scale(0.95);
        }
      `}</style>
    </div>
  );
}
