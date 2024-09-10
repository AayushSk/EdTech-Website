import React, { useEffect, useRef, useState } from 'react'
import {useForm} from "react-hook-form"
import countrycode from "../../../data/countrycode.json"
import { apiConnector } from '../../../services/apiconnector';
import { contactusEndpoint } from '../../../services/apis';
import {toast} from "react-hot-toast"

const ContsctUs = () => {

    // const [formData,setFormData]= useState({firstName:"", lastName:"", email:"", countryCode:"+91",phone:"", message:""})

    // function changeHandler(event){
    //     setFormData((prev)=>({
    //         ...prev,
    //         [event.target.name]:event.target.value
    //     }))
    // }
    const [loading,setLoading]= useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful},
    }=useForm();

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset(
                {email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:"",
                countryCode:""
            }
            )
        }
    },[reset,isSubmitSuccessful])

    const submitContactForm= async(data)=>{
        console.log("Logging Data",data);
        try{
            setLoading(true);
            // const response= await apiConnector("POST",contactusEndpoint.CONTACT_US_API,data);
            var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                var requestOptions = {
                    method: "post",
                    headers: myHeaders,
                    redirect: "follow",
                    body: JSON.stringify([
                        [data.firstName,data.lastName,data.email,data.message,data.countryCode,data.phoneNo,new Date().toLocaleString()]
                    ])}
            const response= await fetch("https://v1.nocodeapi.com/prathmesh_100/google_sheets/QtvEGSOvGovSxrdh?tabId=Sheet1",requestOptions).then(response => response.text())
            console.log("Logging Response",response);
            toast.success("Response recorded Successfully")
            setLoading(false);
        }
        catch(error){
                console.log("Error",error.message);
                toast.error("Something went wrong")
                setLoading(false);
        }
    }

  return (
    <div className='flex flex-col items-center justify-center p-8 w-fit'>
        <form className='mt-8 flex flex-col justify-center'  onSubmit={handleSubmit(submitContactForm)}>
            <div className='flex lg:flex-row flex-col gap-5  ' >
                    <label htmlFor='firstName' className='lg:w-[50%] w-full flex flex-col items-start' >
                        <p className='text-sm text-richblack-5'>First Name</p>
                        <input
                        type='text'
                        name='firstName'
                        id='firstName'
                        placeholder='Enter first name'
                        {...register("firstName",{required:true})}
                        className='bg-richblack-800 px-2 py-2 rounded-md border-b-richblack-500 border-b w-full mt-1'
                        // onChange={changeHandler}
                        />
                        {
                            errors.firstName && (
                                <div className='text-pink-200 text-sm'>
                                    Please enter your first name
                                </div>
                            )
                        }
                    </label>
                    <label htmlFor='lastName' className='lg:w-[50%] w-full flex flex-col items-start'>
                        <p className='text-sm text-richblack-5'>Last Name</p>
                        <input
                        type='text'
                        name='lastName'
                        id='lastName'
                        placeholder='Enter last name'
                        {...register("lastName")}
                        className='bg-richblack-800 px-2 py-2 rounded-md border-b-richblack-500 border-b w-full mt-1'
                        />
                        
                    </label>
            </div>
                    <label htmlFor='email' className='mt-2 flex flex-col items-start' >
                        <p className='text-sm text-richblack-5'>Email Address</p>
                        <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Enter email address'
                        {...register("email",{required:true})}

                        className='bg-richblack-800 px-2 py-2 rounded-md border-b-richblack-500 border-b w-full mt-1'
                        />
                         {
                            errors.email && (
                                <div className='text-pink-200 text-sm'>
                                    Please enter your email address
                                </div>
                            )
                        }
                    </label>
                <div className='w-full mt-2 '>
                    <p className='text-sm text-richblack-5'>Phone Number</p>
                    <div className='flex items-center gap-5'>
                    <select name="countryCode" id="countryCode" className='w-[15%] bg-richblack-800 px-2 py-2 rounded-md border-b-richblack-500 border-b  mt-1 '{...register("countryCode")}  >
                    {/* <option {...register("countryCode")}>+91</option> */}
                    {
                        countrycode.map((data,index)=>{
                            return(
                                <option key={index} value={data.code}>{data.code} - {data.country}</option>
                            )
                        })
                    }
                    </select>
                        <label htmlFor='phoneNo '
                        className='w-full'>
                            <input
                            type='text'
                            name='phoneNo'
                            id="phoneNo"
                            placeholder='enter phone number'
                            className='bg-richblack-800 px-2 py-2 rounded-md border-b-richblack-500 border-b w-full mt-1'
                            {...register("phoneNo",{
                                required:{value:true,message:"Please enter phone number"},
                                maxLength:{value:10,message:'Invalid Phone Number'},
                                minLength:{value:8,message:'Invalid Phone Number'},

                            } )}

                            />
                            
                        </label>
                        
                    </div>
                    {
                            errors.phoneNo && (
                                <div className='text-pink-200 text-sm'>
                                   {errors.phoneNo.message}
                                </div>
                            )
                        }
                </div>
                <div className='mt-2 w-full'>
                    <label htmlFor='message' className='flex flex-col items-start'>
                        <p className='text-sm text-richblack-5'>Message</p>
                        <textarea
                        name="message"
                        id="message"
                        cols="60"
                        rows="7"
                        placeholder='Enter your message here'
                        {...register("message",{required:true})}
                        className='bg-richblack-800 px-2 py-2 rounded-md border-b-richblack-500 border-b w-full mt-1'

                        />
                        {
                            errors.message && (
                                <div className="text-pink-200 text-sm"> 
                                    Please enter your message.
                                </div>
                            )
                        }
                    </label>
                </div>
                <button type="submit"
                className='mt-9 w-full bg-yellow-50 text-black shadow-sm shadow-yellow-200 text-center text-[18px] px-6 py-2 rounded-md font-bold hover:scale-95 transition-all duration-200'>
                            Send Message
                </button>
        </form>
    </div>
  )
}

export default ContsctUs