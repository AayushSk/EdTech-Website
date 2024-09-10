import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {AiOutlineArrowLeft} from "react-icons/ai"
import { getPasswordResetToken } from '../services/authAPI';
const ForgotPassword = () => {
    const {loading} =useSelector((state)=>state.auth);
    const [emailSent,setEmailSent] = useState(false);
    const [email,setEmail] = useState("");
    const dispatch = useDispatch();

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }
  return (
    <div className='w-11/12 max-w-maxContent text-white  flex flex-col justify-center items-center m-auto'>
        {
            loading ? (
                <div className='flex justify-center items-center '> Loading.... </div>
            ):
            (
                <div className=' flex flex-col justify-center items-center lg:items-start lg:w-[500px]'>
                        <h1 className='text-3xl'>
                            {
                                !emailSent ? "Reset your password" 
                                : "Check your email"
                            }
                        </h1>
                        <p className='w-[80%] pt-3 text-richblack-100 text-lg'>
                            {
                                !emailSent ? "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                                :`We have sent the reset email to
                                ${email}`
                            }
                        </p>
                        <form onSubmit={handleOnSubmit}
                        className='w-[80%] py-9'>
                            {
                                !emailSent && (
                                    <label className='flex flex-col gap-2'>
                                        <p className='text-richblack-5 text-sm'>Email Address <span className="text-pink-200">*</span></p>
                                        <input
                                            required
                                            type='email'
                                            name='email'
                                            value={email}
                                            onChange={(e)=>setEmail(e.target.value)}
                                            placeholder='Enter your Email Address'
                                            className="bg-richblack-800 py-2 rounded-md text-white border-b-richblack-700 px-5 "
                                            />
                                    </label>
                                )
                            }
                            <button
                            type='submit'
                            className='mt-9 w-full bg-yellow-50 text-black shadow-sm shadow-yellow-200 text-center text-[18px] px-6 py-2 rounded-md font-bold hover:scale-95 transition-all duration-200'>
                                {
                                !emailSent ? "Reset Password" : "Resend Email"
                                }
                            </button>
                        </form>
                        <div className=''>
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

export default ForgotPassword