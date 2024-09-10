import React from 'react'
import {HiUsers} from "react-icons/hi"
import {ImTree} from "react-icons/im"
const CourseCard = ({cardData,currentCard,setCurrentCard}) => {
  return (
    <div className=' transition-all duration-200 hover:scale-105 hover:-rotate-3'>
        <div className={`flex flex-col w-[320px]  p-5 gap-1 ${currentCard===cardData.heading ? "bg-white text-richblack-700 shadow-[12px_12px_0px] shadow-[#FFD60A]" : "bg-richblack-800 text-richblack-400"}`} onClick={()=>setCurrentCard(cardData.heading)}>
            <h1 className={`text-[20px] font-semibold ${currentCard===cardData.heading  ? "text-richblack-700": "text-white"}`}>{cardData.heading}</h1>
            <p className='text-[14px] leading-6 py-3'>{cardData.description}</p>
            <div className='  border-dashed border mb-1 border-richblack-100 mt-10'></div>
            <div className={`flex justify-between items-center ${currentCard===cardData.heading? "text-blue-500":"text-richblack-400"} font-medium `}>
                <div className='flex justify-center items-center gap-3 '>
                    <HiUsers/>
                    {cardData.level}
                </div>
                <div className='flex justify-center items-center gap-3' >
                    <ImTree/>
                    <p>
                    {cardData.lessionNumber} Lessons
                    </p>
                </div>
            </div>

        </div>
    </div>
  )
}

export default CourseCard