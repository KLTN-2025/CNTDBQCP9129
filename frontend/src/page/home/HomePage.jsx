import React from 'react'
import Banner from './Banner'
import AboutSection from './AboutSection'
const HomePage = () => {
  return (
    <div className='w-full min-h-screen flex flex-col bg-secondaryColor '>
      <Banner/>
      <AboutSection/>
    </div>
  )
}

export default HomePage
