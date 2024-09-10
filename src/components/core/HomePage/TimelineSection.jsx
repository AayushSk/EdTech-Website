import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import Line6 from "../../../assets/TimeLineLogo/Line6.png"
import timelineImage from "../../../assets/Images/TimelineImage.png"
const timeline=[
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo2,
        heading:"Responsibility",
        Description:"Students will always be our top priority",
    },
    {
        Logo:Logo3,
        heading:"Flexibility",
        Description:"The ability to switch is an important skills",
    },
    {
        Logo:Logo4,
        heading:"Solve the problem",
        Description:"Code your way to a solution",
    },
]

const TimelineSection = () => {
  return (
    <div className='mb-[100px]'>
        <div className="flex gap-25 mt-5 max-w-maxContent items-center  justify-around flex-col lg:flex-row ">
            {/* left box */}
            <div className=' flex flex-col gap-11 lg:w-[45%] mr-5'>
                {
                    timeline.map((element,index)=>{
                        return (
                                <div className='flex gap-6 hover:scale-110 transition-all duration-300' key={index}>
                                <div className='w-[50px] h-[50px] bg-white flex items-center justify-center rounded-full'>
                                    <img src={element.Logo} />
                                </div>
                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>
                                </div>
                        )
                        
                    })
                }
            </div>
            {/* right */}
            <div className="relative shadow-blue-200 px-2  ">
                <div className='Ellipse2 relative w-[900px]  h-[400px] opacity-10 bg-gradient-to-br from-[#54cbf6] via-[#0084ff] to-[#F8F8FF] rounded-full blur-2xl z-0 -translate-x-20'>
                </div>
                <img src={timelineImage} alt="timeline image"
                className=" absolute shadow-white object-cover h-fit z-3 translate-y-[-340px] lg:translate-y-[-440px] lg:translate-x-[90px] opacity-10 border-white  " />
            <img src={timelineImage} alt="timeline image"
                className=" absolute shadow-white object-cover h-fit z-5 translate-y-[-350px] lg:translate-y-[-450px] lg:translate-x-20 hover:scale-[1.02] transition-all duration-300" />

            <div className='absolute  bg-caribbeangreen-700 flex lg:flex-row flex-col gap-5 border-2 border-caribbeangreen-100 border-opacity-10 border-blur-xl text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-10 rounded-md'>
                <div className='flex gap-5 items-center lg:border-r  border-caribbeangreen-300 px-7'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                </div>
                <div className='flex gap-5 items-center px-7'>
                    <p className='text-3xl font-bold'>250</p>
                    <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>
                </div>

            </div>
            </div>

                
        </div>
    </div>
  )
}

export default TimelineSection