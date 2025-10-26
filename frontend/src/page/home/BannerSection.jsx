// BannerSection.jsx
import React from "react";
import CoffeeCarousel from "../../components/carousel/Carousel";
import { Parallax } from "react-scroll-parallax";

const BannerSection = () => {
  return (
      <div className="w-full pb-10 relative">
        <CoffeeCarousel
          img1={`/banner.jpg`}
          img2={`/banner2.jpg`}
          img3={`/banner3.jpg`}
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
