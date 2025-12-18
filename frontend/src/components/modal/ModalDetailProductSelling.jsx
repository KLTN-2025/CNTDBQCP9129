import React from "react";
import Modal from "react-modal";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import cartApi from "../../api/cartApi";
import useCartStore from "../../store/cartStore";
import { toast } from "react-toastify";
import { X } from "lucide-react";
const ModalDetailProductSelling = ({
  isOpenModalDetailProduct,
  setIsOpenModalDetailProduct,
  selectedProduct,
}) => {
  console.log("selectedProduct", selectedProduct);
  useLockBodyScroll(isOpenModalDetailProduct)
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setCart } = useCartStore();
  const handleClickAddToCart = async () => {
    try {
      if (!user) {
        navigate("/login");
      }
      const data = {
        productId: selectedProduct._id,
        quantity: 1,
        note: "",
      };
      const res = await cartApi.addToCart(user.id, data);
      if (res && !res.message) {
        setCart(res.items);
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
        localStorage.setItem("cart", JSON.stringify(res.items));
      }
      setIsOpenModalDetailProduct(false);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsOpenModalDetailProduct(false);
    }
  };
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalDetailProduct}
      onRequestClose={() => setIsOpenModalDetailProduct(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
          backdropFilter: "blur(4px)",
                    overflowY: "auto",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "1rem",
          maxHeight: "90vh", // ✅ THÊM DÒNG NÀY
          width: "90%",
          maxWidth: "1200px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <div className="relative rounded-2xl w-full bg-gradient-to-b pb-10 bg-amber-100 to-white max-md:flex-col flex select-none ">
        <div className="flex flex-col w-full pl-10">
          <img
            src={selectedProduct.image}
            className="object-cover w-[400px] h-[500px] max-md:w-[300px] max-md:h-[400px]"
            alt={selectedProduct.name}
          />
          <div className="border-red-600 border-1 rounded-md h-20 w-20 object-cover">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
          </div>
        </div>
        {/* Nội dung thông báo */}
        <div className="w-full px-6 pt-20">
          <p className="text-4xl font-bold">{selectedProduct.name}</p>
          <p className="text-2xl font-bold text-orange-400 mt-6">
            {formatCurrencyVN(selectedProduct.price)}
          </p>
          <p className="text-xl mt-6">{selectedProduct.description}</p>
          <button
            className="bg-orange-500 rounded-full text-white text-xl font-bold mt-10 cursor-pointer px-12 py-4"
            onClick={handleClickAddToCart}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
        <button className="cursor-pointer absolute top-10 right-10"
         onClick={() => setIsOpenModalDetailProduct(false)}
        ><X className="w-10 h-10"/></button>
      </div>
    </Modal>
  );
};

export default ModalDetailProductSelling;
