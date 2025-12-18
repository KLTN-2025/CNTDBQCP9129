import React from "react";
import useCartStore from "../../store/cartStore";
import { Link } from "react-router-dom";
const Cart = ({setIsOpenSidebar}) => {
  const cart = useCartStore((state) => state.cart);
 const countItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <Link to="/checkout">
      <div className="border-2 border-green-700 rounded-md flex px-4 pr-10 cursor-pointer py-2 gap-x-2 items-center group"
       onClick={() => setIsOpenSidebar(false)}
      >
        <img src="/carts.png" className="h-5 w-5 object-cover" alt="giỏ hàng" />
        <span className="font-semibold group-hover:text-green-700">
          Giỏ hàng
        </span>
        <div className="bg-gray-200 px-2 rounded-xs">
          <span className="text-green-700">
            {countItems}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Cart;
