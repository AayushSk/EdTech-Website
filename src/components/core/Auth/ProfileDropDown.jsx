import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../../services/authAPI';
import { AiOutlineCaretDown } from "react-icons/ai"
const ProfileDropDown = () => {

  const {user} = useSelector((state)=>state.profile)
  useEffect(()=>{
    // console.log(user);
  },[]);


  const location=useLocation();
  const current= location.pathname.split('/')[1];
  const [dropdown,setDropdown]= useState(false);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const clickHandler=(e)=>{
    e.preventDefault();
    dispatch(logout(navigate));

  }
  return (
    <div className='relative cursor-pointer transition-all duration-300' >
      <div className={`w-10 h-10 bg-white rounded-full`} onClick={()=>{setDropdown(!dropdown)}}>
        {
          user &&
          
         <div className='flex items-center gap-x-1'>
         <img src={user.image} alt="" className='rounded-full'/>
         <AiOutlineCaretDown className="text-sm text-richblack-100" />
         </div>
        }
      </div>
      {
        dropdown ? 
        (<div className={`absolute flex flex-col items-start text-richblack-200 top-[118%] -right-8 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 ${current==='about'? "bg-richblack-900": "bg-richblack-800"}`}>
            <Link to="/dashboard/my-profile " className='hover:bg-richblack-500  hover:text-richblack-5 w-full  py-2 px-4 border-b'>
              Dashboard
            </Link>
            <div onClick={clickHandler} className='hover:bg-richblack-500  hover:text-richblack-5 w-full py-2 px-4 '> Log Out</div>
        </div>) 
        :(<div></div>)
      }
    </div>

  )
}

export default ProfileDropDown