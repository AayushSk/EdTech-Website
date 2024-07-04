import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import { FaArrowRight } from 'react-icons/fa'
import CTAButton from "../HomePage/Button"

const InstructorSection = () => {
  return (
    <div className='mt-16'>
      <div className='flex lg:flex-row flex-col gap-20 items-center'>

            <div className='lg:w-[50%]'>
                <img src={Instructor}
                     alt=''
                     alert=""
                     className='shadow-white shadow-[-20px_-20px_0_0]'>
                </img>
            </div>

            <div className='lg:w-[50%] flex flex-col gap-10 ml-5'>
                <div className='text-4xl font-semibold lg:w-[50%]'>
                    Become an
                    <HighlightText text={"Instructor"}></HighlightText>
                </div>

                <p className='font-medium text-[16px] w-[90%] text-richblack-300 text-justify'>
                    Instructors from around the world teach millions of students on StudyNotion. we provide the 
                    tools and skills to teach what you love.
                </p>

                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex flex-row gap-2 items-center'>
                            Start Learning Today
                            <FaArrowRight></FaArrowRight>
                        </div>
                    </CTAButton>
                </div>

            </div>

      </div>
    </div>
  )
}

export default InstructorSection
