import React from "react";

const HomeBanner = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/bg-banner.avif')` }}
    >
      <div className="w-full h-full bg-black/30 flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold">Welcome</h1>
      </div>
    </div>
  );
};

export default HomeBanner;
