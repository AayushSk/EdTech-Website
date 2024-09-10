import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabName=[
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
]

const ExploreMore = () => {

    const [currentTab,setCurrentTab]=useState(tabName[0]);
    const [courses,setCourses]= useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard]= useState(HomePageExplore[0].courses[0].heading);
    
    const setMyCards=(value)=>{
        setCurrentTab(value);
        const result= HomePageExplore.filter((course)=> course.tag===value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading)
    }

  return (
    <div className='lg:mb-[85px] lg:mt-20'>
        <div className='text-4xl font-semibold text-center'>
            Unlock the
            <HighlightText text={" Power of Code"}/>
        </div>
        <p className='text-center text-richblack-300 text-[16px] font-medium mt-3'>Learn to build anything you can imagine</p>

        <div className='lg:flex hidden rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 py-1 gap-2 px-2'>
            {
                tabName.map((element,index)=>{
                    return(
                        <div className={`text-[16px] flex flex-row items-center gap-2 
                        ${currentTab===element ? "bg-richblack-900 text-richblack-5 font-medium" 
                        :"text-richblack-200"} rounded-full transition-all duration-300 cursor-pointer hover:bg-richblack-900  hover:text-richblack-5  px-6 py-2`}
                        key={index}
                        onClick={()=>setMyCards(element)}>
                            {element}

                        </div>
                    )
                })
            }
        </div>
        <div>
            <div className='lg:h-[150px]'>
            </div>
            {/* course card */}
            <div className='flex lg:flex-row flex-col  lg:absolute gap-10 items-center justify-center w-full lg:translate-x-[-300px] lg:translate-y-[-130px] mx-auto'>
                {courses.map((element,index)=>{
                    return (
                        <CourseCard 
                        key={index}
                        cardData={element}
                        currentCard={currentCard}
                        setCurrentCard={setCurrentCard}/>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default ExploreMore