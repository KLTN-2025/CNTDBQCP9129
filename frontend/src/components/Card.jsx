import React from "react";

const Card = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="card cursor-pointer">
        <img
          src="/best-seller.png"
          alt="nước uống"
          className="w-full h-full object-cover"
        />
      </div>
      <p className="whitespace-break-spaces font-bold">Trà Đen Macchiato</p>
       <span className="text-gray-400">55.000 đ</span>
    </div>
  );
};

export default Card;
