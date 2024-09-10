import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import about1 from "../assets/Images/aboutus1.webp"
import about2 from "../assets/Images/aboutus2.webp"
import about3 from "../assets/Images/aboutus3.webp"
import {FaQuoteLeft,FaQuoteRight} from "react-icons/fa"
import FoundingStory from "../assets/Images/FoundingStory.png"
import LearningGrid from '../components/core/About US/LearningGrid'
import GetInTouch from '../components/core/About US/GetInTouch'
import Footer from '../components/common/Footer'

const data=[
    ["5K","Active Students"],
    ["10+","Mentors"],
    ["200+","Courses"],
    ["50+","Awards"],
]

const AboutUs = () => {
  return (
    <div className='w-full'>
        {/* hero section */}
        <div className=' flex justify-center items-center bg-richblack-800'>
        <div className='flex flex-col items-center justify-center w-11/12 max-w-maxContent mx-auto text-richblack-200 mt-20'>
            <div className='flex flex-col items-center justify-center lg:w-[59%]'>
            <h1>About Us</h1>
            <div className='mt-9 text-richblack-5 text-4xl flex flex-col justify-center items-center'>
            <p>
                Driving Innovation in Online Education for a
            </p>
            <HighlightText text={"Brighter Future"}/>
            </div>
            <p className='mt-4 text-center'>Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </div>
            <div className='lg:relative mt-13 flex  justify-center items-center w-full lg:h-[210px]'>
                <div className=" lg:absolute  hidden Ellipse2 ml-[60%] w-[500px] h-[300px] -translate-x-[19rem] opacity-20 bg-gradient-to-br from-[#8A2BE2] via-[#FFA500] to-[#F8F8FF] rounded-full blur-3xl" />
            <div className='flex lg:flex-row flex-col gap-6 lg:absolute lg:translate-y-20'>
                    <img src={about1} alt=""  className='hover:scale-95 transition-all duration-300 hover:rotate-6'/>
                    <img src={about2} alt="" className='hover:scale-95 transition-all duration-300 hover:rotate-6'/>
                    <img src={about3} alt="" className='hover:scale-95 transition-all duration-300 hover:rotate-6'/>

            </div>


            </div>
        </div>
    </div>
    {/* qoute section */}
    <div className=' text-center lg:mt-[15rem] mb-20 text-4xl pb-20 border-b border-richblack-600 text-richblack-50  mx-auto'>
        <p className='w-10/12 mx-auto'>
        {/* <FaQuoteLeft className=' translate-x-[-630px] text-2xl text-richblack-600 '/> */}
            We are passionate about revolutionizing the way we learn. Our innovative platform <span className='text-[#20BDFF]'>combines technology</span>, <span className='text-[#E65C00]'>expertise</span>, and community to create an <span className='text-yellow-50'>  unparalleled educational experience</span>.
        {/* <FaQuoteRight className=' translate-x-3 text-2xl text-richblack-600 '/> */}
        </p>
        
    </div>
    {/* about section */}
    <div className='w-11/12 gap-y-20 max-w-maxContent mx-auto flex flex-col justify-center items-center text-richblack-300'>
        <div className='flex lg:flex-row flex-col justify-center items-center gap-[6.2rem]'>
            <div className='gap-6  lg:w-[37%] flex flex-col hover:scale-110 transition-all duration-300'>
                <h1 className='redGradient text-3xl font-bold'>Our Founding Story</h1>
                <p>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>
                <p>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
            </div>
            <div className='relative w-[50%] flex justify-start items-center ml-20'>
            <div className="redBlur  w-[500px] h-[300px] opacity-20" />
            <div className='flex gap-6 absolute '>
            <img src={FoundingStory} alt=""  className='hover:scale-110 transition-all duration-300'/>
                    
            </div>


            </div>
        </div>
        <div className='flex lg:flex-row flex-col justify-start mx-auto items-center gap-[6.2rem] my-10'>
            <div className='gap-6  lg:w-[37%] flex flex-col hover:scale-110 transition-all duration-300'>
                <h1 className='text-[#E65C00] text-3xl font-bold'>Our Vision</h1>
                <p>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
            </div>
            <div className='relative w-[37%] ml-20 flex flex-col justify-center items-start hover:scale-110 transition-all duration-300'>
           
                <h1 className='text-[#1FA2FF] text-3xl font-bold'>Our Mission</h1>
                <p>our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
            </div>


            </div>
        </div>

        {/* STATS */}
        <div className='bg-richblack-800 py-20 mt-20'>
            <div className='w-11/12 mx-auto flex justify-between items-center max-w-maxContent text-richblack-5'>
                {
                    data.map((element,index)=>{
                        return(
                            <div key={index} className='flex flex-col items-center justify-center px-7 gap-y-2'>
                                <h1 className='text-4xl font-bold'>{element[0]}</h1>
                                <p className='text-richblack-500 font-semibold'>{element[1]}</p>
                            </div>
                        )
                    })
                }
            </div>

        </div>

        {/* learning grid */}
        <div className='mt-20'>
                <LearningGrid/>
        </div>
        {/* get In touch */}
        <div className=''>
            <GetInTouch/>
        </div>
        
        <Footer/>
    </div>
  )
}

export default AboutUs