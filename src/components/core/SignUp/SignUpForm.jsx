import React from 'react'
import { useState } from 'react'
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { sendOtp } from '../../../services/authAPI'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { setSignupData } from '../../../slices/authSlice'

const SignUpForm = ({accountType}) => {
    const [formData,setFormData]=useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""})
    const [showPassword,setShowPassword]=useState(false)
    const [showConfirmPassword,setShowConfirmPassword]=useState(false)
    const dispatch= useDispatch();
    const navigate= useNavigate();
    function changeHandler(event)
    {
        setFormData((prev)=>(
            {
                ...prev,
                [event.target.name]:event.target.value
            }
        ))
    }
    const submitHandler=((e)=>{
        e.preventDefault();
        // signUpData=formData;
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords Do Not Match")
            return
          }
          const signUpData = {
            ...formData,
            accountType,
          }
        dispatch(setSignupData(signUpData))
        console.log(signUpData);
        if(signUpData!==null) navigate('/verify-email')
        dispatch(sendOtp(formData.email,navigate))
    })
  return (
    <div className='w-full'>
        <form className='flex flex-col w-full gap-y-4 mt-6' onSubmit={submitHandler}>
            <div className='flex gap-5' >
                <label>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] '>First Name 
                        <sup className='text-pink-200'>*</sup></p>
                    <input
                    required
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder='Enter first name'
                    value={formData.firstName}
                    onChange={changeHandler}
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                    />
                </label>
                <label>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Last Name
                     <sup className='text-pink-200'>*</sup></p>
                    <input
                    required
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder='Enter last name'
                    value={formData.lastName}
                    onChange={changeHandler}
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                    />
                </label>
            </div>
            <div className='w-[69%]'>
            <label>
                <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]'>Email Address
                    <sup className='text-pink-200'>*</sup>
                </p>
                <input
                required
                type='email'
                placeholder='Enter email adresss'
                id='email'
                name='email'
                value={formData.email}
                onChange={changeHandler}
                className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                />
            </label>
            </div>
            <div className='flex gap-5'>
                <label className='relative'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] '> Create Password
                        <sup className='text-pink-200'>*</sup>
                    </p>
                    <input
                    required
                    type={showPassword? ("text" ): ("password")}
                    placeholder='Enter Password'
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={changeHandler}
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                    />
                    <span 
                    className='absolute right-3 top-[40px] '
                    onClick={()=>setShowPassword((prev)=>!prev)}>
                        {showPassword? (<AiOutlineEyeInvisible fontSize={24} fill='#AFC2BF'/> ): (<AiOutlineEye fontSize={24} fill='#AFC2BF'/>)}
                    </span>
                </label>
                <label className='relative'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] '>Confirm Password
                        <sup className='text-pink-200'>*</sup>
                    </p>
                    <input
                    required
                    type={showConfirmPassword? ("text" ): ("password")}
                    placeholder='Enter Password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={changeHandler}
                    className='bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]'
                    />
                    <span 
                    className='absolute right-3 top-[40px] '
                    onClick={()=>setShowConfirmPassword((prev)=>!prev)}>
                        {showConfirmPassword? (<AiOutlineEyeInvisible fontSize={24} fill='#AFC2BF'/> ): (<AiOutlineEye fontSize={24} fill='#AFC2BF'/>)}
                    </span>

                </label>
            </div>
            <button
                type='submit'
                className='mt-9 w-[69%] bg-yellow-50 text-black shadow-sm shadow-yellow-200 text-center text-[18px] px-6 py-2 rounded-md font-bold hover:scale-95 transition-all duration-200'>
                Create Account
            </button>

        </form>
    </div>
  )
}

export default SignUpForm