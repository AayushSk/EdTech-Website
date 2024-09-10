import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from 'react-icons/fa'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/Button'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ReviewSection from '../components/core/HomePage/ReviewSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import Footer from '../components/common/Footer'
function Home() {
  return (
    <div>
        {/* section 1 */}
        <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between z-1 ">

            <Link to={"/signup"} className='group mt-16'>
                <div className="  p-1 mx-auto bg-richblack-800  rounded-full text-richblack-200  transition-all duration-200 hover:scale-95 w-fit  shadow-sm shadow-richblack-700">
                    <div className='flex items-center gap-5 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight></FaArrowRight>
                    </div>
                </div>
            </Link>
            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future with 
                <HighlightText text={" Coding Skills"} />
            </div>

            <div className=" mt-4 w-[90%] text-center text-lg text-richblack-300 font-inter">
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className="flex gap-7 mt-8">
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"}>
                    Book a demo
                </CTAButton>
            </div>
            
            {/* video */}
            <div className="lg:mx-3 lg:my-12  shadow-blue-200  relative z-5 hover:scale-110 transition-all duration-300">
               <div className=" absolute lg:mt-40 lg:mx-40 lg:py-5 rounded-full z-2 w-[200px] h-[300px] bg-white blur-[200px] ">
               </div>
               <video muted loop autoPlay className='lg:h-[500px]  h-[350px]'> 
                        <source src={Banner} type="video/mp4"/>
                </video>
                
            </div>

            {/* code section 1 */}
            <div className='relative w-[100]' >
            <div className=" absolute Ellipse2 ml-[60%] w-[500px] h-[300px] lg:opacity-20 opacity-0 bg-gradient-to-br from-[#8A2BE2] via-[#FFA500] to-[#F8F8FF] rounded-full blur-3xl" />
                    <CodeBlocks 
                    position={"lg:flex-row"}
                    heading={
                        <div className='text-4xl font-semibold '>
                            Unlock your <HighlightText text={" Coding Potential "} /> 
                            with our online courses.
                        </div>
                    }
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

                    ctabtn1={
                        {
                            btnText:"Try it Yourself",
                            linkto:"/signup",
                            active:true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn More",
                            linkto:"/login",
                            active:false,
                        } 
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"\nhref="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                    codeColor={`text-yellow-100`}
                    />
            </div>
            {/* code section 2 */}
            <div className='relative' >
            <div className=" absolute  Ellipse2 w-[500px] h-[300px] lg:opacity-20 opacity-0 bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] rounded-full blur-3xl" />
            
                    <CodeBlocks 
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className='text-4xl font-semibold '>
                            Start 
                            <HighlightText text={` coding`}/>
                            <div><HighlightText text={" in seconds "}/></div>
                        </div>
                    }
                    subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}

                    ctabtn1={
                        {
                            btnText:"Continue Lesson",
                            linkto:"/signup",
                            active:true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn More",
                            linkto:"/login",
                            active:false,
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"\nhref="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
                    codeColor={`text-yellow-100`}
                    />
            </div>
                <ExploreMore/>

        </div>
        {/* section 2 */}
        <div className="bg-pure-greys-5 text-richblack-700 ">
            <div className='homepage_bg h-[320px]'>

                    <div className="w-11/12 max-w-maxContent flex justify-center items-center gap-5 mx-auto">
                        <div className='h-[270px]'></div>
                        <div className='flex lg:flex-row flex-col gap-7 text-white m-auto' >
                            <CTAButton linkto={"/signup"} active={true}>
                                <div className='flex items-center gap-2 shadow-yellow-200'>
                                    Explore Full Catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton linkto={"/signup"} active={false}>
                            Learn More
                            </CTAButton>
                        </div>

                    </div> 
            </div>
            <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-around gap-7 ">
                <div className='flex lg:flex-row flex-col justify-evenly gap-5 mb-10 mt-[95px]'>
                    <div className="text-gray-950 text-4xl font-semibold  leading-10 lg:w-[45%]">
                        Get the skills you need for a
                        <HighlightText text={" job that in demand."} />
                    </div>

                    <div className='text-slate-800 text-base font-lg font-semibold font-popins leading-normal flex flex-col gap-10'>
                        <p>
                        The modern StudyNotion is the dictates its own terms. Today, to be <br/>
                        a competitive specialist requires more than professional skills.
                        </p>
                        <div className="flex items-center mt-8">
                        <CTAButton linkto={"/signup"} active={true}>
                            Learn More
                        </CTAButton>
                        </div>
                    </div>
                </div>
                <TimelineSection/>
                <LearningLanguageSection/>
                
            </div>
            
            
        </div>
        {/* section 3 */}
        <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between z-1 bg-richblack-900">
            
            <InstructorSection/>
            <ReviewSection/>
        </div>
        {/* footer */}
        <div className="bg-richblack-800 text-richblack-400  flex items-center justify-center">
            <Footer/>
        </div>


    </div>
  )
}

export default Home