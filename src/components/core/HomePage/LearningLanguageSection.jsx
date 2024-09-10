import React from 'react'
import HighlightText from "./HighlightText"
import CTAButton from "./Button"
import Know_your_progress from "../../../assets/Images/Know_your_progress.svg"
import Compare_with_others from"../../../assets/Images/Compare_with_others.svg"
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg"
const LearningLanguageSection = () => {
  return (
    <div className='lg:mt-[80px] mt-[120px] mb-20'>
      <div className="flex flex-col gap-25 mt-5 max-w-maxContent items-center  justify-around ">

          <div className='text-4xl font-semibold py-3 '>
          Your swiss knife for
            <HighlightText text={" learning any language"} />
          </div>

          <p className='lg:text-center lg:w-[60%] text-richblack-600 mx-auto font-semibold'>Using spin making learning multiple languages easy with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</p>

          <div className='flex lg:flex-row flex-col items-center justify-center mt-5 relative'>
                <img src={Know_your_progress} alt="Know Your Progress" 
                className=' lg:absolute object-contain lg:translate-x-[-55%] z-1 hover:scale-110 transition-all duration-400 hover:-rotate-6' />

                <img src={Compare_with_others} alt="Compare with others"
                className='object-contain lg:translate-x-[100px] z-1 hover:scale-110 transition-all duration-400 hover:rotate-2' />

                <img src={Plan_your_lessons} alt="Plan your lessons"
                className='lg:absolute object-contain lg:translate-x-[90%] z-1 hover:scale-110 transition-all duration-300 hover:-rotate-3' />

          </div>
          <div className="py-9">
          <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
          </div>
          
      </div>
    </div>
  )
}

export default LearningLanguageSection