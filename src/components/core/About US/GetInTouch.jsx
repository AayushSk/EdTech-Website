import React, { useState } from 'react'
import countrycode from "../../../data/countrycode.json"
import ContsctUs from '../../common/ContactPage/ContsctUs'

const GetInTouch = () => {


  return (
    <div className='mt-20 flex flex-col items-center justify-center m-auto w-11/12 max-w-maxContent text-richblack-200'>
        <h1 className='text-4xl text-richblack-5 font-semibold'>Get in Touch</h1>
        <p className='mt-2'>We’d love to here for you, Please fill out this form.</p>
        
        <div className='flex justify-center items-center m-auto lg:w-[50%]'>
            <ContsctUs/>
        </div>
    </div>
  )
}

export default GetInTouch