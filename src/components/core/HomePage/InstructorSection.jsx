import React from 'react'
import HighlightText from './HighlightText'
import Button from './Button'
import {FaArrowRight} from 'react-icons/fa'
import Instructor from "../../../assets/Images/Instructor.png"
const InstructorSection = () => {
  return (
    <div className='mt-16 mb-20'>
        <div className='flex lg:flex-row flex-col max-w-maxContent gap-20 items-center'>
            <div className='realtive hidden lg:flex lg:w-[50%]'>
                <img src={Instructor} alt="" className='shadow-white' />
            </div>
            <div className='flex flex-col lg:w-[50%] gap-10'>
                <div className='text-4xl font-semibold'>
                <div>Become an </div>
                <HighlightText text={"instructor"} />
                </div>
                <p className='font-medium text-[16px] w-[65%] text-richblack-300'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
                <div className='realtive lg:hidden'>
                <img src={Instructor} alt="" className='shadow-white' />
            </div>
                <div className='w-fit'>
                <Button linkto={"/signup"} active={true}>
                    <div className='flex items-center justify-center gap-4'>
                        Start Teaching Today
                        <FaArrowRight/>
                    </div>
                </Button>
                </div>


            </div>

        </div>
    </div>
  )
}

export default InstructorSection