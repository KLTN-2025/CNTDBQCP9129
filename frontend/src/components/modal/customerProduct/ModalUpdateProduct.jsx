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

const ModalUpdateProduct = ({
  itemUpdate,
  isOpenModalUpdateItem,
  setIsOpenModalUpdateItem,
}) => {
  useLockBodyScroll(isOpenModalUpdateItem);

  const [isExpanded, setIsExpanded] = useState(false);
  const [count, setCount] = useState(itemUpdate.quantity);
  const charLimit = 80;
  const description = itemUpdate.productId.description || "";
  const shouldShowToggle = description.length > charLimit;
  const [note, setNote] = useState(itemUpdate.note);
  const {user} = useAuthStore();
  const {cart, setCart} = useCartStore();
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
  console.log(itemUpdate);
  const handleClickUpdate = async() => {
    try {
      const updateData = {
        productId: itemUpdate.productId._id,
        quantity: count,
        note
      }
      console.log(updateData);
      await cartApi.updateCartItem(user.id, updateData);
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      const cartUpdate = cart.map((item) => item.productId._id === itemUpdate.productId._id ? {...item, note: note, quantity: count} : item)
      setCart(cartUpdate);
      localStorage.setItem("cart", JSON.stringify(cartUpdate));
      setIsOpenModalUpdateItem(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalUpdateItem}
      onRequestClose={() => setIsOpenModalUpdateItem(false)}
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
            src={itemUpdate.productId.image}
            alt={itemUpdate.productId.name}
            className="w-26 h-26 rounded-full"
          />
          <div className="space-y-4 flex-1">
            <p className="text-xl font-bold">{itemUpdate.productId.name}</p>
            <div className="flex items-center gap-4 font-bold text-2xl">
              {itemUpdate.productId.discount > 0 && (
                <span className="line-through text-gray-400">
                  {formatCurrencyVN(itemUpdate.productId.price)}
                </span>
              )}
              <span className="text-red-500 font-bold">
                {itemUpdate.productId.discount > 0
                  ? formatCurrencyVN(
                      itemUpdate.productId.price * (1 - itemUpdate.productId.discount / 100)
                    )
                  : formatCurrencyVN(itemUpdate.productId.price)}
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
         onClick={handleClickUpdate}
        >Thêm món vào giỏ hàng</button>
      </div>
    </Modal>
  );
};

export default ModalUpdateProduct;
