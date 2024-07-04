import React from 'react'
import { MdClose } from "react-icons/md"
import { useState, useEffect } from 'react'
import { useSelector } from "react-redux"

const ChipInput = ({label, name, placeholder, register, errors, setValue, getValues}) => {

    const {editCourse, course} = useSelector((state) => state.course)

    // Setting up state for managing chips array
    const [chips, setChips] = useState([])

    useEffect(() => {
        if (editCourse) {
            // console.log(course)
            setChips(course?.tag)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValue(name, chips)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chips])

    // Function to handle user input when chips are added
    const handleKeyDown = (event) => {
        // Check if user presses "Enter" or ","
        if (event.key === "Enter" || event.key === ",") {
            // Prevent the default behavior of the event
            event.preventDefault()
            // Get the input value and remove any leading/trailing spaces
            const chipValue = event.target.value.trim()
            // Check if the input value exists and is not already in the chips array
            if (chipValue && !chips.includes(chipValue)) {
            // Add the chip to the array and clear the input
            const newChips = [...chips, chipValue]
            setChips(newChips)
            event.target.value = ""
      }
    }
  }

    // Function to handle deletion of a chip
    const handleDeleteChip = (chipIndex) => {
        // Filter the chips array to remove the chip with the given index
        const newChips = chips.filter((_, index) => index !== chipIndex)
        setChips(newChips)
    }

  return (
    <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor={name}>{name}<sup className='text-pink-200'>*</sup></label>
        <div className="flex w-full flex-wrap gap-y-2">
            {
                chips.map((chip, index) => (
                    <div key={index} className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5">
                        {chip}
                        <button
                            type='button'
                            className='ml-2 focus:outline-none'
                            onClick={() => handleDeleteChip(index)}
                        >
                            <MdClose className="text-sm"></MdClose>
                        </button>
                    </div>
                ))
            }
            <input
            id={name}
            name={name}
            type='text'
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className='form-style w-full'
            ></input>
        </div>
        {
            errors[name] && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                    {label} is required
                </span>
            )
        }
    </div>
  )
}

export default ChipInput
