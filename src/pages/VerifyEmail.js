import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OtpInput from 'react-otp-input';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { sendOtp, signUp } from '../services/authAPI';
import {FaClockRotateLeft} from "react-icons/fa6"

const VerifyEmail = () => {
    const {signUpData,loading} = useSelector((state)=>state.auth)
    const dispatch =useDispatch();
    const [otp, setOtp] = useState('');
    const navigate= useNavigate();
   
    useEffect(()=>{
            if(!signUpData){
                navigate("/signup");
            }
    },[])
    const submitHandler = (e)=>{
        e.preventDefault();
        console.log(signUpData);
        const {accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            }=signUpData;

        dispatch(signUp(accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate))
    }
  return (
    <div className='text-yellow-50 flex justify-center items-center m-auto'>
        {
            loading ? (<div>Loading...</div>)
            :(
                <div className='flex flex-col justify-center items-start text-richblack-5 w-[85%]'>
                    <h1 className='text-3xl font-semibold'>Verify email</h1>
                    <p className='mt-3 text-richblack-300'>A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={submitHandler} className='mt-6 w-full text-richblack-500'>
                        <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                          <input
                            {...props}
                            placeholder="-"
                            style={{
                              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                          />
                        )}
                        containerStyle={{
                          justifyContent: "space-between",
                          gap: "0 6px",
                        }}/>

                        <button type="submit"
                        className='mt-9 w-full bg-yellow-50 text-black shadow-sm shadow-yellow-200 text-center text-[18px] px-6 py-2 rounded-md font-bold hover:scale-95 transition-all duration-200'>
                            Verify Email
                        </button>
                    </form>

                    <div className='flex mt-4 justify-between items-center w-full'>
                        <div>
                            <Link to="/login" className='flex items-center justify-center gap-2 text-richblack-100 hover:text-richblack-25'>
                                <AiOutlineArrowLeft/>
                                <p>Back to Login</p>
                            </Link>
                        </div>

                        <button onClick={()=>dispatch(sendOtp(signUpData.email,navigate))} className='flex gap-2 text-blue-100 hover:text-blue-50 justify-center items-center'>
                            <FaClockRotateLeft/>
                            Resend it
                            </button>
                    </div>

                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail