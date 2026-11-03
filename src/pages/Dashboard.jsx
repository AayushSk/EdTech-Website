import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {
    const { loading: authLoading } = useSelector((state) => state.auth)
    const { loading: profileLoading, user } = useSelector((state) => state.profile)

    if (profileLoading || authLoading) {
        return (
            <div className='mt-10'>Loading...</div>
        )
    }

    if (user === null) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
            <Sidebar />
            <div className='min-h-[calc(100vh-3.5rem)] overflow-auto flex justify-center items-center w-full'>
                <div className='mx-auto w-11/12 max-w-maxContent py-10'>
                    <Outlet />
                </div>

            </div>
        </div>
    )
}

export default Dashboard