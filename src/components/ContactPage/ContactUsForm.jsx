import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/apis';
import CountryCode from '../../data/countrycode.json'

const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging Data", data);
        try {
            setLoading(true);
            const response = await apiConnector(
                "POST", 
                contactusEndpoint.CONTACT_US_API, 
                data
            );
            // const response = {status:"OK"};
            console.log("Logging response", response);
            setLoading(false);
        }
        catch (error) {
            console.log("Error:", error.message);
            setLoading(false);
        }
    }

    useEffect( () => {
        if(isSubmitSuccessful) {
            reset({
                email: "",
                firstName: "",
                lastName: "",
                message: "",
                phoneNo: "",
            })
        }
    },[reset, isSubmitSuccessful])
  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
      
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-5 lg:flex-row'>
                {/* firstName */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor='firstname' className='lable-style'>First Name</label>
                    <input
                    type='text'
                    name='firstname'
                    id='firstname'
                    placeholder='Enter first name'
                    className='form-style'
                    {...register("firstname", {required: true})}
                    ></input>
                    {
                        errors.firstname && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your name
                            </span>
                        )
                    }
                </div>

                {/* lastName */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor='lastname' className='lable-style'>Last Name</label>
                    <input
                    type='text'
                    name='lastname'
                    id='lastname'
                    placeholder='Enter last name'
                    className='form-style'
                    {...register("lastname")}
                    ></input>
                </div>    
            </div>

            {/* email */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='email' className='lable-style'>Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Enter email Address'
                    className='form-style'
                    {...register("email", {required: true})}
                ></input>
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your email address
                        </span>
                    )
                }
            </div>

            {/* phoneNO. */}
            <div className='flex flex-col gap-2'>

                <label htmlFor='phonenumber' className='lable-style'>Phone Number</label>

                <div className='flex gap-5'>
                    {/* dropdown */}
                    <div className="flex w-[81px] flex-col gap-2">
                        <select
                        name='dropdown'
                        id='dropdown'
                        className='form-style'
                        {...register("countrycode", {required: true})}
                        >
                            {
                                CountryCode.map( (element, index) => {
                                    return (
                                        <option key={index} value={element.code}>
                                            {element.code} -{element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                        type='number'
                        name='phonenumber'
                        id='phonenumber'
                        placeholder='12345 67890'
                        className='form-style'
                        {...register("phoneNo", {
                            required: {value:true, message:"Please enter Phone Number"}, 
                            maxLength: {value:10, message:"Invalid Phone Number"},
                            minLength: {value:8, message:"Invalid Phone Number"} })}
                        ></input>
                    </div>
                </div>
                {
                    errors.phoneNo && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            {errors.phoneNo.message}
                        </span>
                    )
                }
            </div>

            {/* message */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='message' className='lable-style'>Message</label>
                <textarea
                    name='message'
                    id='message'
                    cols={30}
                    rows={7}
                    placeholder='Enter your message here'
                    className='form-style'
                    {...register("message", {required: true})}
                ></textarea>
                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your message
                        </span>
                    )
                }
            </div>
        </div>

        <button disabled={loading} type='submit'
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}>
            Send Message
        </button>

    </form>
  )
}

export default ContactUsForm
