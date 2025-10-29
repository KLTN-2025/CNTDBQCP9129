import React, { useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { FaClock } from "react-icons/fa6";
import StoreMapIframe from "../../components/StoreMapIframe";
const ShopPage = () => {
  const shopImages = [
    "/view-shop4.jpg",
    "/view-shop5.jpg",
    "/view-shop6.jpg",
    "/view-shop7.jpg",
    "/view-shop8.jpg",
  ];
  const [pickedImage, setPickedImage] = useState(0);
  return (
    <div className="w-full bg-gradient-to-b bg-yellow-100 to-white max-sm:px-4 px-20 mx-auto pt-20 space-y-10">
      <h1 className="text-md font-bold text-center">ĐN, Bạch Đằng</h1>
      <div className="flex max-lg:flex-col gap-x-10 gap-y-10">
        <div className="flex-1 space-y-6">
          <img
            src={shopImages[pickedImage]}
            alt="cửa hàng"
            className="object-cover w-full rounded-xl h-[500px]"
          />
          <div className="flex items-center justify-between">
            {shopImages.map((image, i) => (
              <img
                key={i}
                src={image}
                className="object-cover rounded-lg cursor-pointer w-30 h-26 max-md:w-20 max-sm:h-16 max-sm:w-16 max-md:h-20"
                alt="cửa hàng"
                onClick={() => setPickedImage(i)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">ĐN, Bạch Đằng</h2>
          <div className="flex items-center gap-x-4 mt-2">
            <MdLocationPin className="text-orange-500 text-3xl ml-[-3px]" />
            <p>12 Bạch Đằng, Hải Châu, Đà Nẵng</p>
          </div>
          <div className="flex items-center gap-x-4 mt-4">
            <FaClock className="text-orange-500 text-2xl" />
            <p className="text-xl">07:00 - 22:00</p>
          </div>
          <StoreMapIframe/>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
