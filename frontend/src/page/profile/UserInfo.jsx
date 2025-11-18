import React from 'react'

const UserInfo = ({user}) => {
  return (
    <div className='space-y-3'>
      <h2 className='text-xl font-bold text-green-700'>Thông tin tài khoản</h2>
      <p><span className='font-bold'>Tên người dùng: </span>{user.name}</p>
      <p><span className='font-bold'>Email: </span>{user.email}</p>
    </div>
  )
}

export default UserInfo
