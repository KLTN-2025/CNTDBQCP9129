import React from 'react'
import Blog from '../../components/Blog'
const MyStorySection = () => {
  return (
    <div className='flex flex-col bg-secondaryColor w-full px-20 max-lg:px-4 gap-y-10'>
      <h2 className='font-bold text-center text-2xl py-4'>Chuyện của Coffee Go</h2>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-16 flex-1'>
        <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
        <Blog/>
      </div>
    </div>
  )
}

export default MyStorySection
