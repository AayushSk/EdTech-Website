import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible, AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/authAPI';
import {TiTick} from "react-icons/ti"

const passwordStg=[
    "one lowercase character",
    "one special character",
    "one uppercase character",
    "8 character minimum",
    "one number"
]

const UpdatePassword = () => {

    const dispatch=useDispatch();
    const location = useLocation();
    const {loading}= useSelector((state)=>state.auth)
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:"",
    });
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false)
    
    const changePassword=(e)=>{
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name] : e.target.value
        }))
    }

    const handleOnSubmit = (e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);
        dispatch(resetPassword(formData.password,formData.confirmPassword,token));

    }
  return (
    <div className='text-white flex justify-center items-center m-auto  '>
        {
            loading?(
                <div>Loading...</div>
            )
            :(
                <div className='flex flex-col w-[90%] '>
                    <h1 className='text-richblack-5 text-3xl font-bold '>Choose new password</h1>
                    <p className='mt-3 text-richblack-100 text-md'>Almost done. Enter your new password and youre all set.</p>
                    <form onSubmit={handleOnSubmit} className='mt-6 gap-2 flex flex-col'>
                        <label>
                            <p className='text-richblack-5 text-sm'>New password <span className='text-pink-100'>*</span></p>
                            <input
                            placeholder='Enter your new password'
                            required
                            type={showPassword?"text":"password"}
                            name='password'
                            value={formData.password}
                            onChange={changePassword}
                            className='w-full bg-richblack-800 py-2 rounded-md px-2 mt-1 relative'
                            />
                            <span onClick={(()=>setShowPassword(!showPassword))}
                            className='absolute translate-y-4 text-xl text-richblack-300 -translate-x-9'>{
                                showPassword?<AiFillEye/>:<AiFillEyeInvisible/>
                                }</span>

                        </label>
                        <label >
                            <p className='text-richblack-5 text-sm' >Confirm new password <span className='text-pink-100'>*</span></p>
                            <input
                            placeholder='Enter your new password'
                            required
                            type={showConfirmPassword?"text":"password"}
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={changePassword}
                            className='w-full bg-richblack-800 py-2 rounded-md px-2 mt-1 relative'
                            />
                            <span onClick={(()=>setShowConfirmPassword(!showConfirmPassword))}
                            className='absolute translate-y-4 text-xl text-richblack-300 -translate-x-9'>{
                                showConfirmPassword?<AiFillEye/>:<AiFillEyeInvisible/>
                                }</span>

                        </label>

                        <div className='grid grid-cols-2 text-[11px] '>
                            {
                                passwordStg.map((element,index)=>{
                                    return(
                                        <div className='flex justify-start items-center gap-4 text-caribbeangreen-400 py-1 font-medium'>
                                            <div className='flex justify-center items-center rounded-full bg-caribbeangreen-400'>
                                                <TiTick className='text-white'/>
                                                </div>
                                            <p>{element}</p>
                                            </div>
                                    )
                                })
                            }

                        </div>

                        <button type="submit"
                        className='mt-3 w-full bg-yellow-50 text-black shadow-sm shadow-yellow-200 text-center text-[18px] px-6 py-2 rounded-md font-bold hover:scale-95 transition-all duration-200'>
                            Reset Password
                        </button>
                    </form>
                    <div className=' flex justify-start items-center mt-5'>
                            <Link to="/login" className='flex items-center justify-center gap-2 text-richblack-100 hover:text-richblack-25'>
                                <AiOutlineArrowLeft/>
                                <p>Back to Login</p>
                            </Link>
                        </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword