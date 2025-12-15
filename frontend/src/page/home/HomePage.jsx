import BannerSection from './BannerSection'
import IntroduceSection from './IntroduceSection'
import ViewShopSection from './ViewShopSection'
import BestSellerSection from './BestSellerSection'
import MyStorySection from './MyStorySection'
import { useEffect } from 'react'
const HomePage = () => {
  useEffect(() => {
      document.title = `Coffee Go`;
  }, []);
  return (
    <div className='w-full min-h-screen flex flex-col bg-secondaryColor'>
      <BannerSection/>
      <IntroduceSection/>
      <BestSellerSection/>
      <ViewShopSection/>
      <MyStorySection/>
    </div>
  )
}

export default HomePage
