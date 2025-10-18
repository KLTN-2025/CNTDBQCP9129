import React from "react";
import Card from "../../components/Card";
const BestSeller = () => {
  return (
    <div className="flex flex-col px-20 max-lg:px-4">
      <h2 className="font-bold text-2xl text-center">Món bán chạy</h2>
      <div className="grid grid-cols-4 flex-1 py-20 max-lg:py-10 gap-6 w-full gap-x-20 max-lg:grid-cols-2 max-lg:gap-x-6">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default BestSeller;
