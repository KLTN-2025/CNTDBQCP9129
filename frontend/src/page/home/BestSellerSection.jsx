import React from "react";
import Card from "../../components/Card";
import { useEffect } from "react";
import { useState } from "react";
import productApi from "../../api/productApi";
import { toast } from "react-toastify";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
const BestSellerSection = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getTopSellingProducts = async () => {
      try {
        const res = await productApi.getTopSellingProducts();
        setProducts(res);
      } catch (error) {
        toast.error(error);
      }
    };
    getTopSellingProducts();
  }, []);
  console.log("products", products);
  return (
    <div className="flex flex-col px-20 max-lg:px-4 w-full bg-gradient-to-t bg-yellow-100 to-white">
      <div className="w-full flex justify-center">
        <img src="/top-selling.png" className="object-cover" alt="tiêu đề" />
      </div>
      <div className="grid grid-cols-4 flex-1 pb-20 max-lg:py-10 gap-6 w-full gap-x-20 max-lg:grid-cols-2 max-lg:gap-x-6">
        {products.map((product) => (
          <div className="flex flex-col items-center justify-center">
            <img
              src={product.image}
              className="lg:w-[400px] hover:scale-125 transition duration-500"
              alt={product.name}
            />
            <p className="text-md font-medium">
              {product.productCategoryId.name}
            </p>
            <p className="text-xl font-bold mt-4">{product.name}</p>
            <p className="text-2xl font-bold mt-4 text-orange-500">
              {formatCurrencyVN(product.price * (1 - product.discount / 100))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerSection;
