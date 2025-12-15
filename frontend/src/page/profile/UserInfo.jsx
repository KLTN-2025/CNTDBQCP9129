import React from 'react'
import { useEffect } from 'react';

const UserInfo = ({user}) => {
  useEffect(() => {
      document.title = `Thông tin tài khoản`;
  }, []);
  return (
    <div className='space-y-3 w-full'>
      <h2 className='text-xl font-bold text-center'>Thông tin tài khoản</h2>
      <p><span className='font-bold'>Tên người dùng: </span>{user.name}</p>
      <p><span className='font-bold'>Email: </span>{user.email}</p>
    </div>
  )
}

export default UserInfo
