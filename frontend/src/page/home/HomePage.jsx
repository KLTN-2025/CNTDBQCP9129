import React from 'react'
import Banner from './Banner'
import IntroduceSection from './IntroduceSection'
import ViewShopSection from './ViewShopSection'
const HomePage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col bg-secondaryColor '>
      <Banner/>
      <IntroduceSection/>
      <ViewShopSection/>
    </div>
  )
}

export default HomePage
