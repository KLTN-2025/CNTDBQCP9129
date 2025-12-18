import { Link } from 'react-router-dom'

const News = ({setIsOpenSidebar}) => {
  return (
    <div>
      <Link to="/blogs/coffeeholic"
       onClick={() => setIsOpenSidebar(false)}
      >
       <span className='hover:text-green-700 cursor-pointer'>TIN TỨC</span>
      </Link>
    </div>
  )
}

export default News
