import React from "react";
import { Parallax } from "react-scroll-parallax";

const IntroduceSection = () => {
  return (
    <div className="w-full px-20 pb-10 flex items-center gap-x-6 max-lg:flex-col max-lg:pt-10 max-lg:gap-y-8 max-sm:px-4">
      <div
        className="bg-cover bg-no-repeat flex justify-center items-center w-1/2 relative rounded-2xl shadow-md max-lg:w-full"
        style={{ backgroundImage: `url('/bg-section1.jpg')` }}
      >
        <img
          src="/product_coffee.png"
          alt="cà phê Việt Nam"
          className="object-contain w-[220px] h-[500px] max-sm:w-[160px] max-sm:h-[160px]"
        />
         <div className="absolute top-[10%] right-[5%] z-[20]">
          <Parallax speed={10}>
            <img src="/sticker-coffee.png" alt="sticker" className="w-16 max-md:w-10" />
          </Parallax>
        </div>
         <div className="absolute top-[10%] left-[5%] z-[20]">
          <Parallax speed={10}>
            <img src="/sticker-coffee1.png" alt="sticker" className="w-16 max-md:w-10" />
          </Parallax>
        </div>
      </div>

      <div className="grid grid-cols-1 w-1/2 rounded-2xl overflow-hidden shadow-md max-lg:w-full max-lg:grid-cols-1">
        <img
          src="/bg-section2.jpg"
          alt="cà phê Việt Nam"
          className="object-cover w-full h-full"
        />
        <div className="flex items-center justify-center bg-[#f6f4ef] p-6 text-gray-800">
          <p className="leading-relaxed text-justify">
            Được vun trồng trên vùng đất đỏ bazan màu mỡ của Buôn Ma Thuột – thủ
            phủ cà phê Việt Nam, những hạt cà phê nơi đây hấp thụ tinh hoa của
            đất trời, sương sớm và nắng gió Tây Nguyên. Từng cây cà phê được
            chăm sóc cẩn thận qua nhiều mùa mưa nắng, kết tinh nên hương vị đậm
            đà, nồng nàn và trọn vẹn. Khi rang xay, hương thơm lan tỏa quyến rũ,
            vị cà phê Buôn Ma Thuột vừa mạnh mẽ, vừa thanh thoát, mang đậm bản
            sắc và tinh thần của núi rừng Tây Nguyên.
          </p>
        </div>
          <button className="w-full bg-blue-300 py-2 font-bold cursor-pointer">Thử ngay</button>
      </div>
    </div>
  );
};

export default IntroduceSection;
