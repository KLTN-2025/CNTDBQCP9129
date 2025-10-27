import { Link } from 'react-router-dom'
import React from 'react'

const News = () => {
  return (
    <div>
      <Link to="/blogs/coffeeholic">
       <span className='hover:text-green-700 cursor-pointer'>TIN TỨC</span>
      </Link>
    </div>
  )
}

export default News
