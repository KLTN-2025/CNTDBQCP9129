// BannerSection.jsx
import React from "react";
import { Parallax } from "react-scroll-parallax";
import Carousel from "../../components/carousel/Carousel";
const BannerSection = () => {
    const bannerImages = [
    {
      images: ["/banner4.png"],
    },
    {
      images: ["/banner2.jpg"],
    },
    {
      images: ["/banner3.jpg"],
    },
    {
      images: ["/banner.jpg"],
    },
  ];
  return (
      <div className="w-full pb-10 relative">
        <Carousel
         images={bannerImages}
        />
        <div className="absolute top-[20%] right-[10%] z-[20] max-md:top-[38%] max-md:right-[16%]">
          <Parallax speed={10}>
            <img src="/sticker.png" alt="sticker" className="w-24 max-md:w-8" />
          </Parallax>
        </div>
      </div>
  );
};

export default BannerSection;
