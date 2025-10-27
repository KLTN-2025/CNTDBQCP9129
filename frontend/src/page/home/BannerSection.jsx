// BannerSection.jsx
import React from "react";
import { Parallax } from "react-scroll-parallax";
import Carousel from "../../components/carousel/Carousel";
const BannerSection = () => {
  return (
      <div className="w-full pb-10 relative">
        <Carousel
        />
        <div className="absolute top-[20%] right-[10%] z-[20]">
          <Parallax speed={10}>
            <img src="/sticker.png" alt="sticker" className="w-24 max-md:w-16" />
          </Parallax>
        </div>
      </div>
  );
};

export default BannerSection;
