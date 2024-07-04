import React from 'react'
import UpdatePassword from '../../../../pages/UpdatePassword'
import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"

const Settings = () => {
  return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Profile
        </h1>
        {/* Change Profile Picture */}
        <ChangeProfilePicture></ChangeProfilePicture>
        {/* Profile */}
        <EditProfile></EditProfile>
        {/* Password */}
        <UpdatePassword></UpdatePassword>
        {/* Delete Account */}
        <DeleteAccount></DeleteAccount>
    </div>
  )
}

export default Settings
