import React, { useState } from 'react'
import LoginImg from "../assets/Images/login.webp"
import InstructorImg from "../assets/Images/instructor.jpeg"
import frame from "../assets/Images/frame.png"
import CTAButton from '../components/core/HomePage/Button';
import LoginForm from '../components/core/SignUp/LoginForm';

const tabName=[

  "Student",
  "Instructor",
]
const Login = () => {

  const [active,setActive]=useState(tabName[0]);
  
  const setMyCards=(value)=>{
    setActive(value);
}

  return (
  
    <div className=' text-white mt-20 mb-20'>
        <div className='flex justify-evenly w-11/12 mx-auto'>
          {/* left section */}
            <div className='flex flex-col justify-start w-[50%] ml-20'>
                <div className='text-3xl font-semibold w-[60%] '>
                Welcome Back
                </div>
                {
                  active==='Student'?
                  <p className="font-light text-richblack-100 w-[58%] mt-3">Build skills for today, tomorrow, and beyond. 
                <span className="text-blue-200 italic text-base font-bold font-['Edu SA Beginner'] leading-normal"> Education to future-proof your career.</span>
                </p>
                :
                <p className="font-light text-richblack-100 w-[58%] mt-3">Discover your passions,
                <span className="text-blue-200 italic text-base font-bold font-['Edu SA Beginner'] leading-normal"><br/>Be Unstoppable</span>
                </p>
                }
                <div className='flex bg-richblack-800 w-fit rounded-3xl px-1 gap-1 py-1 border-b border-richblack-200 mt-9 transition-all duration-200 '>
                    {tabName.map((element,index)=>{
                        return(
                          <div
                          key={index}
                          className={`${active===element ? "bg-richblack-900 text-white":"text-richblack-200"} rounded-3xl px-5 py-2 transition-all duration-200 font-medium`}
                           onClick={()=>setMyCards(element)}>
                            {element}
                            </div>
                        )
                    })}
                </div>
                <div className='mt-9'>
                  <LoginForm/>
                  
                </div>
                  
            </div>
            {/* right */}
            <div className='relative w-[50%]'>
                <img src={frame} alt="" className='absolute z-1 translate-x-3 translate-y-3' />
                {
                  active==='Student' ?
                  <img src={LoginImg} alt=""  className='absolute z-2'/>
                  :<img src={InstructorImg} alt=""  className='absolute z-2 w-[84%] h-[103%]'/>
                }
            </div>
        </div>
    </div>
  )
}

export default Login