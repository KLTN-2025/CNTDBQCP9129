import React from "react";
import CoffeeCarousel from "../../components/carousel/Carousel";
const BannerSection = () => {
  return (
    <div className="w-full pb-10">
      <CoffeeCarousel img1={`/banner.jpg`} img2={`/banner2.jpg`} img3={`/banner3.jpg`}/>
      {/* <img
        src="/banner.jpg"
        alt="banner"
        className="w-full h-auto object-contain"
      /> */}
    </div>
  );
};

export default BannerSection;
