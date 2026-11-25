import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isSessionChecked } = useSelector((state) => state.auth)

    if (!isSessionChecked) {
        return <div className="grid min-h-[40vh] place-items-center"><div className="spinner" /></div>
    }

    if (isAuthenticated) {
        return children
    }
    return <Navigate to="/login" />
}

export default PrivateRoute