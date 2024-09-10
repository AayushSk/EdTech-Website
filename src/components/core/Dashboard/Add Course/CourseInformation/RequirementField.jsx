import React, { useEffect, useState } from 'react'

const RequirementField = ({name,id,label,register,errors,setValue,getValues}) => {
    const [requirement,setRequirement]=useState("")
    const [requirementList,setRequirementList]=useState([])

    const handleAddRequirement=()=>{
        if(requirement){
            setRequirementList([...requirementList,requirement]);
            setRequirement("");
        }
    }
    const handleRemoveRequirement=(index)=>{
        const updatedRequirementList=[...requirementList];
        updatedRequirementList.splice(index,1);
        setRequirementList(updatedRequirementList);
    }

    useEffect(()=>{
        register(name,{
            required:true,
            Validate:(value)=>value.length>0
        })
    },[])

    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])

  return (
    <div>
        <label htmlFor={id}>{label}<sup>*</sup></label>
        <input type="text" 
        name={name} 
        id={id}
        value={requirement} 
        onChange={(e)=>setRequirement(e.target.value)}
        className='w-full'/>
        <button
            type="button"
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50'>
            Add
        </button>
        {
            requirementList.length>0 && (
                <ul>
                    {
                        requirementList.map((requirement,index)=>{
                            return(
                                <li key={index} className='flex items-center'>
                                        <span>{requirement}</span>
                                        <button
                                        type="button"
                                        onClick={()=>handleRemoveRequirement(index)}
                                        className='text-sm text-pure-greys-300'>
                                        clear
                                        </button>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
        {
            errors[name] &&(
                <span>{label} is required</span>
            )
        }
    </div>
  )
}

export default RequirementField