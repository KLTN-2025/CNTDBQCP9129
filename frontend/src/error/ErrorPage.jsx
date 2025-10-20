import React from 'react'
import { Link } from 'react-router-dom'
const ErrorPage = () => {
  return (
   <div className="w-full flex flex-col items-center pt-10 h-screen">
    <img src="/error.gif" alt="hỏng" className="w-50 h-40 object-cover" />
    <p className="text-center">Liên kết này đã bị hỏng. <Link to='/'><span className="text-red-600">Quay lại trang chủ</span></Link></p>
  </div>
  )
}

export default ErrorPage
