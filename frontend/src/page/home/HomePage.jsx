import React from 'react'
import BannerSection from './BannerSection'
import IntroduceSection from './IntroduceSection'
import ViewShopSection from './ViewShopSection'
import BestSellerSection from './BestSellerSection'
const HomePage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col bg-secondaryColor '>
      <BannerSection/>
      <IntroduceSection/>
      <BestSellerSection/>
      <ViewShopSection/>
    </div>
  )
}

export default HomePage
