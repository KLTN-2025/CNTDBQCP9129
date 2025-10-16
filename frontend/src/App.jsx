import './App.css'
import LayoutPage from './layout/LayoutPage'
import {Routes, Route} from 'react-router-dom'
import HomeBanner from './page/home/HomeBanner'
import LoginPage from './page/auth/LoginPage'
function App() {

  return (
    <>
      <LayoutPage>
        <Routes>
          <Route path='/' element={<HomeBanner/>}/>
         <Route path='/account/login' element={<LoginPage/>}/>
        </Routes>
      </LayoutPage>
    </>
  )
}

export default App
