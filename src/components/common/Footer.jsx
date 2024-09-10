import React from 'react'
import Logo_Full_Light from "../../assets/Logo/Logo-Full-Light.png"
import { Link } from 'react-router-dom'
import {AiFillGoogleCircle,AiFillTwitterCircle} from "react-icons/ai"
import {BiLogoFacebookCircle} from "react-icons/bi"
import {BsYoutube} from "react-icons/bs"
import {FooterLink2} from "../../data/footer-links"

const Resourses=[
    "Articles",
   "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
]

const Plans=[
    "Paid memberships",
    "For students",
    "Business solutions",
]

const Community=[
    "Forums",
    "Chapters",
    "Events",
]




const Footer = () => {
  return (
    <div className='w-11/12 max-w-maxContent text-richblack-400 mx-auto'>
        
        <div className='flex justify-center max-w-maxContent mt-20'>
            {/* left */}
            <div className='flex justify-between w-[50%] border-r-2 border-richblack-700  px-8'>
                {/* logo */}
                <div className='flex flex-col gap-2 py-2'>
                    <Link to="/">
                    <img src={Logo_Full_Light} alt="" />
                    </Link>
                    <Link to="/">
                        <h1 className='font-bold text-richblack-5 hover:text-white duration-300 transition-all'>Company</h1>
                    </Link>
                    <Link to="/about">
                    <h1 className='hover:text-white duration-300 transition-all '>About</h1>
                    </Link>
                    <Link to="/Careers">
                    <h1 className='hover:text-white duration-300 transition-all '>Careers</h1>
                    </Link>
                    <Link to="/Affiliates">
                    <h1 className='hover:text-white duration-300 transition-all '>Affiliates</h1>
                    </Link>
                    <div className='flex gap-3 text-xl'>
                        <BiLogoFacebookCircle className='hover:text-white duration-300 transition-all '/>
                        <AiFillGoogleCircle className='hover:text-white duration-300 transition-all '/>
                        <AiFillTwitterCircle className='hover:text-white duration-300 transition-all '/>
                        <BsYoutube className='hover:text-white duration-300 transition-all '/>

                    </div>
                    
                </div>
                {/* resourse */}
                <div className='flex flex-col'>
                    <Link to="/">
                            <h1 className='font-bold text-richblack-5 hover:text-white duration-300 transition-all'>Resources</h1>  
                    </Link>
                    <div className='py-2'>
                    {
                        Resourses.map((element,index)=>{
                            return(
                                <div key={index} className='hover:text-white duration-300 transition-all py-1 '>
                                        {element}
                                </div>
                                )
                                })
                    }
                    </div>
                    <div className='mt-5'>
                        <h1 className='font-bold text-richblack-5 hover:text-white duration-300 transition-all '>Support</h1>  
                        <h1>Help Center</h1>
                    </div>
                </div>
                {/* plans & community */}
                <div className='flex flex-col'>
                    <h1 className='font-bold text-richblack-5'>Plans</h1>
                    <div className='py-2'>
                        {
                            Plans.map((element, index) =>{
                                return(
                                    <div 
                                    className='hover:text-white duration-300 transition-all py-1'
                                    key={index} >
                                        {element}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='mt-5'>
                    <h1 className='font-bold text-richblack-5'>Community</h1>
                    <div className='py-2'>
                        {
                            Community.map((element, index) =>{
                                return(
                                    <div 
                                    className='hover:text-white duration-300 transition-all py-1'
                                    key={index} >
                                        {element}
                                    </div>
                                )
                            })
                        }
                    </div>
                    </div>

                     
                </div>

            </div>
            {/* right */}
            <div className='flex justify-between w-[50%] '>
                {/* Subject */}
                <div className='flex flex-col ml-20'>
                    <h1 className='text-white font-bold'>{FooterLink2[0].title}</h1>
                    <div className='py-2'>
                        {
                            FooterLink2[0].links.map((element,index) =>{
                                return(
                                    <div key={index}>
                                        <Link to={element.link} className='hover:text-white duration-300 transition-all pt-1'>
                                        {element.title}  </Link>   
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {/* Languages */}
                <div className='flex flex-col'>
                    <h1 className='text-white font-bold'>{FooterLink2[1].title}</h1>
                    <div className='py-2'>
                        {
                            FooterLink2[1].links.map((element,index) =>{
                                return(
                                    <div key={index}>
                                        <Link to={element.link} className='hover:text-white duration-300 transition-all px-1'>
                                        {element.title}  </Link>   
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {/* Career building  */}
                <div className='flex flex-col'>
                    <h1 className='text-white font-bold'>{FooterLink2[2].title}</h1>
                    <div className='py-2'>
                        {
                            FooterLink2[2].links.map((element,index) =>{
                                return(
                                    <div key={index}>
                                        <Link to={element.link} className='hover:text-white duration-300 transition-all py-1'>
                                        {element.title}  </Link>   
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        {/* bottom */}
        <div className='border-t border-richblack-700 mt-10'>
            <div className='flex justify-between py-10'>
                <div className='flex gap-5'>
                    <Link to={"/privacy-policy"}>
                        <p className='hover:text-white duration-300 transition-all '>Privacy Policy</p>
                    </Link>
                    <Link to={"/cookie-policy"}>
                        <p className='hover:text-white duration-300 transition-all '>Cookie Policy</p>
                    </Link>
                    <Link to={"/terms"}>
                        <p className='hover:text-white duration-300 transition-all '>Terms</p>
                    </Link>
                </div>
                <div>
                Made By Aayush © 2023 EdTech
                </div>
            </div>
            
        </div>
        

    </div>
  )
}

export default Footer