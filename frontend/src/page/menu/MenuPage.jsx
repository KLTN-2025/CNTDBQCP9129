import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import productApi from "../../api/productApi";
import productCategoryApi from "../../api/productCategoryApi";
import { useParams } from "react-router-dom";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN.js";
import { Link } from "react-router-dom";
import ModalDetailProduct from "../../components/modal/customerProduct/ModalDetailProduct.jsx";
import voucherApi from "../../api/voucherApi.js";
import CouponItem from "../../components/CouponItem.jsx";
const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const { categorySlug } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [isOpenModalDetailProduct, setIsOpenModalDetailProduct] =
    useState(false);
  // lấy 10 sản phẩm random
  useEffect(() => {
    const getLimitProducts = async () => {
      try {
        const data = await productApi.getLimitedProducts();
        setProducts(data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getLimitProducts();
  }, []);
  // lấy danh mục sản phẩm
  useEffect(() => {
    const getCategoryProduct = async () => {
      try {
        const data = await productCategoryApi.getAll();
        setProductCategories(data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getCategoryProduct();
  }, []);
  useEffect(() => {
    const getProductByCategory = async () => {
      try {
        const data = await productApi.getByCategory(categorySlug);
        setProducts(data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    if (categorySlug) {
      getProductByCategory();
    }
  }, [categorySlug]);
  useEffect(() => {
    const getAvailableVouchers = async() => {
      try {
        const data = await voucherApi.getAvailableVouchers();
        setVouchers(data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    getAvailableVouchers();
  }, []);
  return (
    <div className="mx-auto px-20 max-sm:px-4 pt-4 w-full bg-gradient-to-b bg-amber-100 to-white">
      
      {vouchers.length > 0 && (
        <div className="w-full flex items-center justify-between px-20 mt-10">
          {vouchers.map((voucher) => (
           <CouponItem voucher={voucher}/>
          ))}
        </div>  
      )} 
      <h1 className="text-2xl font-bold text-center mt-10">Sản phẩm từ Nhà</h1>
      <div className="flex flex-col justify-center items-center mt-10 gap-y-20 max-sm:gap-y-10">
        <div className="flex justify-start gap-x-10 gap-y-4 overflow-x-auto w-full py-2 px-2 md:justify-center max-w-4xl md:flex-wrap">
          {productCategories.map((category) => (
            <Link key={category._id} to={`/menu/${category.slug}`}>
              <div className="flex-shrink-0 text-center space-y-2 w-24">
                <div
                  className={`flex justify-center items-center px-4 py-4 rounded-2xl cursor-pointer ${
                    category.name === categorySlug
                      ? "bg-yellow-500"
                      : "bg-yellow-100"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-20 h-20 object-cover rounded-full"
                  />
                </div>
                <p
                  className={`${
                    category.name === categorySlug
                      ? "text-orange-500"
                      : "text-gray-400"
                  } text-xs font-semibold`}
                >
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center flex-wrap w-full gap-x-10 mx-auto gap-y-14">
          {products &&
            products.length > 0 &&
            products.map((product) => (
              <div className="w-full relative flex sm:flex-col sm:max-w-[230px] max-sm:gap-x-6 gap-y-4 rounded-xl px-4 py-4 shadow-xl cursor-pointer"
               onClick={() => {
                setProductDetail(product);
                setIsOpenModalDetailProduct(true);
               }}
              >
                {!product.status && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-xl z-10 flex items-center justify-center">
                    <p className="text-white font-bold">Hết hàng</p>
                  </div>
                )}
                <img
                  src={product.image}
                  className="w-full max-sm:w-20 max-sm:h-20 object-cover"
                  alt={product.name}
                />
                <div className="space-y-4">
                  <p className="text-lg truncate">{product.name}</p>
                  <div className="flex items-center gap-4 text-lg">
                    {product.discount > 0 && (
                      <span className="line-through text-gray-400">
                        {formatCurrencyVN(product.price)}
                      </span>
                    )}
                    <span className="text-red-500 font-bold">
                      {product.discount > 0
                        ? formatCurrencyVN(
                            product.price * (1 - product.discount / 100)
                          )
                        : formatCurrencyVN(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isOpenModalDetailProduct && (
        <ModalDetailProduct
          isOpenModalDetailProduct={isOpenModalDetailProduct}
          setIsOpenModalDetailProduct={setIsOpenModalDetailProduct}
          productDetail={productDetail}
        />
      )}
    </div>
  );
};

export default MenuPage;
