import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import SIdebar from '../components/core/Dashboard/SIdebar'
import MyProfile from '../components/core/Dashboard/MyProfile'

const Dashboard = () => {

    const {loading: authLoading} = useSelector((state)=>state.auth)
    const {loading: profileLoading,user} = useSelector((state)=>state.profile)
    // console.log(user)
    const navigate=useNavigate();
    if(user===null)  navigate("/login");
    if(profileLoading || authLoading) {
        return(
            <div className='mt-10'>Loading...</div>
        )
    }


  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
        <SIdebar/>
        <div className='min-h-[calc(100vh-3.5rem)]  overflow-auto flex justify-center items-center w-full'>
            <div className='mx-auto w-11/12 max-w-maxContent py-10'>
                <Outlet/>
            </div>

        </div>
    </div>
  )
}

export default Dashboard