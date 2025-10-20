import React from 'react'

const UserInfo = ({user}) => {
  return (
    <div>
      <h2 className='text-xl font-bold text-green-700'>Thông tin tài khoản</h2>
      <p><span className='font-bold'>Họ tên: </span>{user.name}</p>
      <p><span className='font-bold'>Email: </span>{user.email}</p>
    </div>
  )
}

export default UserInfo
