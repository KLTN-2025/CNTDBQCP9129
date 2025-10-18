import React from "react";
import Carousel from "../../components/carousel/Carousel";
const ViewShopSection = () => {
  return (
    <div className="w-full px-20 pb-10 flex items-center gap-x-6 max-lg:flex-col max-lg:pt-10 max-lg:gap-y-8 max-sm:px-4">
      <div className="flex flex-col gap-y-14">
        <div>
          <p className="font-bold text-2xl">SIGNATURE </p>
          <p className="font-bold text-3xl">BY COFFEE GO</p>
          <p className="whitespace-break-spaces text-lg">
            Nơi cuộc hèn tràn đây với cà phê đặc sản và không gian cảm hứng
          </p>
        </div>
        <button className="animate-button">
          <span className="shadow"></span>
          <span className="edge"></span>
          <span className="front text font-semibold"> Tìm hiểu thêm</span>
        </button>
      </div>

      <div className="grid grid-cols-1 w-full rounded-2xl h-[500px] overflow-hidden shadow-md max-lg:w-full max-lg:grid-cols-1">
        <Carousel
          img1={"/view-shop1.png"}
          img2={"/view-shop2.png"}
          img3={"/view-shop3.png"}
        />
      </div>
    </div>
  );
};

export default ViewShopSection;
