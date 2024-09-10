import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'

import Logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {HiOutlineShoppingCart} from "react-icons/hi"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import {AiOutlineDown} from "react-icons/ai"

const subLinks=[
  {
    name:'AI/ML',
    
  },
  {
    name:'DSA',
  },
  {
    name:'Operating Systems',
  },
  {
    name:'Networking',
  },
  {
    name:'WEB-DEV',
  }
]

const Navbar = () => {

  const {token} =useSelector((state)=>state.auth);
  const {user} =useSelector((state)=>state.profile);
  const {totalItems} =useSelector((state)=>state.cart);



  const location=useLocation()

  // api call
  // const [subLinks,setSubLinks] = useState([]);

  // const fetchSublinks= async() =>{
  //   try{
  //     // console.log("Fetching")
  //      const result = await apiConnector(`GET`,categories.CATEGORIES_API);
  //     //  console.log("result fetched")
  //     //  console.log("printing sublinks: ", result)
  //       setSubLinks(result.data.data)
 
  //       const a= await fetch(`http://localhost:4000/api/v1/course/showAllCategories`)
  //       // console.log("fetch data",a)
  //   }
  //   catch(error){
  //     console.log("Could not fetch category list")
  //   }
  // }
  // useEffect(()=>{
  //     fetchSublinks();
  //   },[])


  const matchRoute=(route) =>{
    return matchPath({path:route}, location.pathname)
    
  }

  return (
    <div className='flex  h-14 items-center justify-center border-b-[1px] border-b-richblack-700 '>
      <div className='w-11/12 flex max-w-maxContent items-center justify-between'>
      {/* logo */}
      <Link to="/">
        <img src={Logo} alt="logo" width={160} height={42}  />
      </Link>
      
      {/* nav link */}
      <nav>
        <ul className='flex gap-x-6 text-richblack-25'>
        {
          NavbarLinks.map((element,index)=>{
            return(
              <li key={index}>
                {
                  element.title==='Catalog' 
                  ? (<div className='flex justify-center hover:text-yellow-25 items-center gap-x-2 group relative'>
                    <p className=''>{element.title}</p>
                    <AiOutlineDown/>
                    <div className="invisible absolute left-[50%] top-[50%]  z-[1000] translate-x-[-50%] translate-y-[40%]  flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                    <div className='absolute left-[50%]  -z-10  top-0 translate-y-[-45%] select-none translate-x-[80%] h-6 w-6 rotate-45 rounded bg-richblack-5  '>
                    </div>
                        {
                          subLinks.length ? (subLinks.map((element,index)=>{
                            return(
                              
                                <Link to={`/catalog/${element.name}` } key={index}
                                className="rounded-md bg-transparent py-4 pl-5 hover:bg-richblack-50 transition-all duration-200">
                                {element.name}
                                </Link>
                  
                            )
                          })) : (<div></div>)
                        }


                    </div>
                   
                    
                  </div>) 
                  :(<Link to={element.path}>
                      <p className={`${matchRoute(element.path)? "text-yellow-25":"text-richblack-25"} hover:text-yellow-25`}>
                        {element.title}
                      </p>
                    </Link>)
                }
              </li>
            )
          })
        }
        </ul>
      </nav>
        {/* login/signup/dashboard */}
      <div className='flex gap-x-4 items-center'>
        {
          user && user?.accountType !=="Instructor" && (
            <Link to="/dashboard/cart" className='relative text-richblack-5 text-xl'>
                <HiOutlineShoppingCart/>
                {
                  totalItems>0 && (
                    <span>
                      {totalItems}
                    </span>
                  )
                }
            </Link>
          )
        }
        {
          token===null && (
            <Link to="/login">
              <div className='bg-richblack-800 text-richblack-100 py-2 px-3 rounded-lg border border-richblack-700 hover:bg-richblack-700 transition-all duration-200'>Log in</div>
            </Link>
          )
        }
        {
          token===null && (
            <Link to="/signup">
              <div className='bg-richblack-800 text-richblack-100 py-2 px-3 rounded-lg border border-richblack-700 hover:bg-richblack-700 transition-all duration-200'>
                  Sign up
              </div>
            </Link>
          )
        }
        {
          token !== null && <ProfileDropDown />
        }
      </div >
      </div>
    </div>
  )
}

export default Navbar