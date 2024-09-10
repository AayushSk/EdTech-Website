import React from 'react'
import { useState } from 'react'
import CTAButton from "../../../components/core/HomePage/Button"
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../../services/authAPI'

const LoginForm = () => {
    const [formData,setFormData]=useState({email:"",password:""})
    const [showPassword,setShowPassword]=useState(false)
    const dispatch=useDispatch();
    const navigate=useNavigate();
    function changeHandler(event)
    {
        setFormData((prev)=>(
            {
                ...prev,
                [event.target.name]:event.target.value
            }
        ))
    }

    const handleonSubmit=(e)=> {
        e.preventDefault();
        dispatch(login(formData.email,formData.password,navigate))
    }
  return (
    <div className='w-full'>
        <form className='flex flex-col w-full gap-y-4 mt-6' onSubmit={handleonSubmit}>
            
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
            <div className='flex w-[69%]'>
                <label className='relative w-full'>
                    <p className='text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] '>Password
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
            </div>
            <div className='text-blue-100 flex justify-center flex-row-reverse  items-center translate-x-[4rem] hover:text-blue-50' >
                <Link to="/login/forgot-password" >
                    Forgot Password
                </Link>
            </div>
            <button
                type='submit'
                className='mt-9 w-[69%] bg-yellow-50 text-black shadow-sm shadow-yellow-200 text-center text-[18px] px-6 py-2 rounded-md font-bold hover:scale-95 transition-all duration-200'>
                Sign in
            </button>

        </form>
    </div>
  )
}

export default LoginForm