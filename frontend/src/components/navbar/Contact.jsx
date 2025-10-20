import React from 'react'
import { BiSolidPhoneCall } from "react-icons/bi";
const Contact = () => {
  return (
    <div className='flex items-center gap-x-4'>
      <BiSolidPhoneCall className='text-green-700 text-3xl'/>
      <span className='hover:text-green-700 cursor-pointer'>Liên hệ</span>
    </div>
  )
}

export default Contact
