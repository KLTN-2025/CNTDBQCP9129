import React from "react";
import Carousel from "../../components/carousel/Carousel";
import { Link } from "react-router-dom";
const ViewShopSection = () => {
  const viewShopImages = [
    {
      images: ["/view-shop5.jpg"],
    },
    {
      images: ["/view-shop4.jpg"],
    },
    {
      images: ["/view-shop7.jpg"],
    },
    {
      images: ["/view-shop6.jpg"],
    },
    {
      images: ["/view-shop8.jpg"],
    },
    {
      images: ["/view-shop9.jpg"],
    },
    {
      images: ["/view-shop10.jpg"],
    },
  ];
  return (
    <div className="w-full px-20 pb-10 flex lg:items-center gap-x-6 max-lg:flex-col max-lg:pt-10 max-lg:gap-y-8 max-md:px-10 max-sm:px-4">
      <div className="flex flex-col gap-y-14">
        <div>
          <p className="font-bold text-2xl">SIGNATURE </p>
          <p className="font-bold text-3xl">BY COFFEE GO</p>
          <p className="whitespace-break-spaces text-lg">
            Nơi cuộc hèn tràn đây với cà phê đặc sản và không gian cảm hứng
          </p>
        </div>
        <Link to="/shop">
          <button className="animate-button">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front text font-semibold"> Tìm hiểu thêm</span>
          </button>
        </Link>
      </div>

      <div className={`grid grid-cols-1 w-full rounded-2xl md:h-[400px] lg:h-[500[px] overflow-hidden shadow-md max-lg:w-full max-lg:grid-cols-1`}>
        <Carousel images={viewShopImages} />
      </div>
    </div>
  );
};

export default ViewShopSection;
