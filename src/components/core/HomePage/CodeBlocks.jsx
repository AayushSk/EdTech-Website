import React from 'react'
import {FaArrowRight} from 'react-icons/fa'
import CTAButton from "./Button"
import { TypeAnimation } from 'react-type-animation'
const CodeBlocks=({
    position,heading,subheading,ctabtn1,ctabtn2,backgroundGradient, codeColor,codeblock
}) =>{
  return (
    <div className={`flex ${position} lg:my-20  mb-20 lg:items-center lg:justify-between gap-10 flex-col`}>
        
    {/* section1  */}
    <div className="lg:w-[50%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 font-bold">
            {subheading}
        </div>
        <div className="flex gap-7 mt-7">
             <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
             <div className='flex gap-2 mx-auto items-center text-center'>
             {ctabtn1.btnText}
             <FaArrowRight></FaArrowRight>
             </div>
             </CTAButton>
             <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >         
             {ctabtn2.btnText}
             </CTAButton>
        </div>

    </div>
    
    {/* section 2 */}
    <div className='flex h-fit text-[20px] w-[100%] py-2 lg:w-[450px] '>
        {/* gradinet */}
        <div className=" lg:hidden absolute Ellipse2 ml-[60%] w-[500px] h-[300px] -translate-x-[11rem] opacity-20 bg-gradient-to-br from-[#8A2BE2] via-[#FFA500] to-[#F8F8FF] rounded-full blur-3xl" />
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
            <p>13</p>
        </div>
        <div className={` w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
            <TypeAnimation 
            sequence={[codeblock, 5000,""]}
            repeat={Infinity}
            cursor={true}
            style={
                {
                    whiteSpace:'pre-line',
                    display:"block"

                }
            }
            omitDeletionAnimation={true}
            />
        </div>
    </div>

    </div>
  )
}

export default CodeBlocks