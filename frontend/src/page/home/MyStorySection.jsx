import React, { useEffect, useState } from 'react'
import BlogCard from '../../components/BlogCard'
import blogApi from '../../api/blogAPI';
import { toast } from 'react-toastify';
const MyStorySection = () => {
  const [randomBlogs, setRandomBlogs] = useState([]);
  useEffect(() => {
    const fetchRandomBlogs = async() => {
      try {
        const blogs = await blogApi.getRandom();
        setRandomBlogs(blogs)

      } catch (error) {
        toast.error('Lỗi lấy bài viết random', error)
      }
    }
    fetchRandomBlogs()
  }, []);
  return (
    <div className='flex flex-col bg-white w-full px-20 max-lg:px-4 gap-y-10'>
      <h2 className='font-bold text-center text-2xl py-4'>Chuyện của Coffee Go</h2>
      <div className='grid grid-cols-3 max-lg:grid-cols-1 gap-16 flex-1'>
        {randomBlogs.length > 0 && randomBlogs.map((blog) => (
          <div key={blog._id}>
            <BlogCard blog={blog}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyStorySection
