import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import { useState } from "react";
import { formatCurrencyVN } from "../../../utils/formatCurrencyVN";
import { HiOutlinePlus } from "react-icons/hi";
import { HiMinus } from "react-icons/hi2";
import { CgNotes } from "react-icons/cg";
import { toast } from "react-toastify";
import cartApi from "../../../api/cartApi";
import useAuthStore from "../../../store/authStore";
import useCartStore from "../../../store/cartStore";

const ModalDetailProduct = ({
  isOpenModalDetailProduct,
  setIsOpenModalDetailProduct,
  productDetail,
}) => {
  useLockBodyScroll(isOpenModalDetailProduct);

  const [isExpanded, setIsExpanded] = useState(false);
  const [count, setCount] = useState(1);
  const charLimit = 80;
  const description = productDetail.description || "";
  const shouldShowToggle = description.length > charLimit;
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  const {user} = useAuthStore();
  const {addToCart, cart} = useCartStore();
  const displayedText =
    !isExpanded && shouldShowToggle
      ? description.slice(0, charLimit) + "..."
      : description;
  const handleClickPlus = () => {
    setCount((prev) => prev + 1);
  };
  const handleClickMinus = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };
  const handleClickAddToCart = async () => {
    try {
      if(isLoading) return 
      setIsLoading(true);
      if(note.length > 50) return toast.error("Ghi chú quá dài");
      if(count < 1) return toast.error("Số lượng nhỏ hơn 1");
      const data = {
        productId: productDetail._id,
        quantity: count,
        note
      }
      const res = await cartApi.addToCart(user.id, data);
      // addToCart(res.);
      localStorage.setItem("cart", cart);
      console.log(cart);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalDetailProduct}
      onRequestClose={() => setIsOpenModalDetailProduct(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "8rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "0.5rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "460px",
        },
      }}
    >
      <div className="mx-auto overflow-hidden rounded-md w-full flex flex-col p-4 gap-y-4">
        <div className="w-full flex gap-x-4">
          <img
            src={productDetail.image}
            alt={productDetail.name}
            className="w-26 h-26 rounded-full"
          />
          <div className="space-y-4 flex-1">
            <p className="text-xl font-bold">{productDetail.name}</p>
            <div className="flex items-center gap-4 font-bold text-2xl">
              {productDetail.discount > 0 && (
                <span className="line-through text-gray-400">
                  {formatCurrencyVN(productDetail.price)}
                </span>
              )}
              <span className="text-red-500 font-bold">
                {productDetail.discount > 0
                  ? formatCurrencyVN(
                      productDetail.price * (1 - productDetail.discount / 100)
                    )
                  : formatCurrencyVN(productDetail.price)}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <p className="text-gray-700 text-sm">{displayedText}</p>
          {shouldShowToggle && (
            <button
              className="mt-1 text-orange-500 cursor-pointer text-sm font-medium hover:underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Rút gọn" : "Xem thêm"}
            </button>
          )}
        </div>
        <div className="flex">
          <button
            className="p-1 rounded-full bg-orange-600 cursor-pointer"
            onClick={handleClickMinus}
          >
            <HiMinus className="text-2xl text-white" />
          </button>
          <span className="px-4 text-xl">{count}</span>
          <button
            className="p-1 rounded-full bg-orange-600 cursor-pointer"
            onClick={handleClickPlus}
          >
            <HiOutlinePlus className="text-2xl text-white" />
          </button>
        </div>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
          <div className="flex items-center justify-center px-3 text-gray-500">
            <CgNotes className="text-lg" />
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 h-10 px-2 outline-none focus:ring-0 focus:border-none"
            placeholder="Nhập ghi chú cho món này"
          />
        </div>
        <button className="py-2 w-full text-center bg-orange-400 text-white rounded-md font-bold cursor-pointer"
         onClick={handleClickAddToCart}
        >Thêm món vào giỏ hàng</button>
      </div>
    </Modal>
  );
};

export default ModalDetailProduct;
