import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./Pages/Home"
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import Navbar from './components/common/Navbar'
import ForgotPassword from './Pages/ForgotPassword'
import UpdatePassword from './Pages/UpdatePassword'
import VerifyEmail from './Pages/VerifyEmail'
import AboutUs from './Pages/AboutUs'
import Dashboard from './Pages/Dashboard'
import MyProfile from './components/core/Dashboard/MyProfile'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import Error from './Pages/Error'
import Settings from './components/core/Dashboard/Settings'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses'
import Cart from './components/core/Dashboard/Cart'
import { ACCOUNT_TYPE } from './utils/constants'
import { useSelector } from 'react-redux'
import AddCourse from './components/core/Dashboard/Add Course'
import Contact from './Pages/Contact'

function App() {
  const {user}=useSelector((state)=>state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/login/forgot-password" element={<ForgotPassword/>} />
        <Route path="/login/update-password/:id" element={<UpdatePassword/>} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/about" element={<AboutUs/>} /> 
        <Route path="/contact" element={<Contact/>} />
        <Route
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
          >
        <Route path="/dashboard/my-profile" element={<MyProfile/>} />
        <Route path="/dashboard/settings" element={<Settings/>} />
        

         {
          user?.accountType=== ACCOUNT_TYPE.STUDENT && (
            <>
            <Route path='/dashboard/enrolled-courses' element={<EnrolledCourses/>} />
            <Route path='/dashboard/cart' element={<Cart/>} />
            </>
          )
         } 
        {
          user?.accountType=== ACCOUNT_TYPE.INSTRUCTOR && (
            <>
            <Route path='/dashboard/add-course' element={<AddCourse/>} />
            </>
          )
         } 
          </Route>
        <Route path='*' element={<Error/>}/>


      </Routes>
    </div>
  )
}

export default App