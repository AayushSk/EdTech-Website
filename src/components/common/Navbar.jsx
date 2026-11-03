import React, { useEffect, useState } from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'

import Logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { useSelector } from 'react-redux'
import { HiOutlineShoppingCart } from "react-icons/hi"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { AiOutlineDown } from "react-icons/ai"

const defaultSubLinks = [
  { name: 'AI/ML' },
  { name: 'DSA' },
  { name: 'Operating Systems' },
  { name: 'Networking' },
  { name: 'WEB-DEV' },
]

const Navbar = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const [subLinks, setSubLinks] = useState(defaultSubLinks)

  const location = useLocation()

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector('GET', categories.CATEGORIES_API)
        if (result?.data?.data && result.data.data.length > 0) {
          setSubLinks(result.data.data)
        }
      } catch (error) {
        // Fall back to defaultSubLinks if API call fails
      }
    }
    fetchSublinks()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 '>
      <div className='w-11/12 flex max-w-maxContent items-center justify-between'>
        {/* logo */}
        <Link to="/">
          <img src={Logo} alt="logo" width={160} height={42} />
        </Link>

        {/* nav link */}
        <nav>
          <ul className='flex gap-x-6 text-richblack-25'>
            {NavbarLinks.map((element, index) => {
              return (
                <li key={index}>
                  {element.title === 'Catalog' ? (
                    <div className='flex justify-center hover:text-yellow-25 items-center gap-x-2 group relative cursor-pointer'>
                      <p>{element.title}</p>
                      <AiOutlineDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] translate-x-[-50%] translate-y-[40%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                        <div className='absolute left-[50%] -z-10 top-0 translate-y-[-45%] select-none translate-x-[80%] h-6 w-6 rotate-45 rounded bg-richblack-5'></div>
                        {subLinks.length > 0 ? (
                          subLinks.map((subLink, subIndex) => (
                            <Link
                              to={`/catalog/${subLink.name}`}
                              key={subIndex}
                              className="rounded-md bg-transparent py-4 pl-5 hover:bg-richblack-50 transition-all duration-200"
                            >
                              {subLink.name}
                            </Link>
                          ))
                        ) : (
                          <div>No categories</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={element.path}>
                      <p
                        className={`${matchRoute(element.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                          } hover:text-yellow-25`}
                      >
                        {element.title}
                      </p>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        {/* login/signup/dashboard */}
        <div className='flex gap-x-4 items-center'>
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className='relative text-richblack-5 text-xl'>
              <HiOutlineShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <div className='bg-richblack-800 text-richblack-100 py-2 px-3 rounded-lg border border-richblack-700 hover:bg-richblack-700 transition-all duration-200'>
                Log in
              </div>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <div className='bg-richblack-800 text-richblack-100 py-2 px-3 rounded-lg border border-richblack-700 hover:bg-richblack-700 transition-all duration-200'>
                Sign up
              </div>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  )
}

export default Navbar