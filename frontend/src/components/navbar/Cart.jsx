import React from 'react'
import { FaCartShopping } from "react-icons/fa6";
const Cart = () => {
  return (
    <div className='border-2 border-green-700 rounded-md flex px-4 cursor-pointer py-2 gap-x-2 items-center group'>
      <FaCartShopping/>
      <span className='font-semibold group-hover:text-green-700'>Giỏ hàng</span>
      <div className='bg-gray-300 px-2 rounded-xs'>
      <span className='text-green-700'>0</span>
      </div>
    </div>
  )
}

export default Cart
