import React from 'react'
import Home from './Home'
import Menu from './Menu'
import Booking from './Booking'

const NavbarHeader = () => {
  return (
    <div className='w-full bg-mainColor h-[100px] flex items-center justify-between px-20'>
      <img src="/logo_coffee.png" className='w-20 h-20 rounded-full object-cover' alt="logo coffee go" />
      <div className='flex gap-x-5 items-center font-bold'>
        <Home/>
        <Menu/>
        <Booking/>
      </div>
    </div>
  )
}

export default NavbarHeader
