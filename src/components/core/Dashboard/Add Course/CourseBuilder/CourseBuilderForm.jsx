import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { CiCirclePlus } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { MdNavigateNext } from "react-icons/md";
import NestedView from './NestedView';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/courseDetailsAPI';
// import Section from '../../../../../../server/models/Section';
const CourseBuilderForm = () => {

  const {register,handleSubmit,setValue,formState:{errors}} = useForm();
  const [editSectionName,setEditSectionName] = useState(null);
  const {course}= useSelector((state)=>state.course)
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);
  const {token} = useSelector((state)=>state.auth)

  const cancelEdit=()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const goBack=()=>{
      dispatch(setStep(1));
      dispatch(setEditCourse(true));
  }

  const goToNext =()=>{
      if(course.courseContent.length===0)
      {
        toast.error("Please add atleast one section");
        return ;
      }
      if(course.courseContent.some((section)=> section.subSection.length ===0))
      {
        toast.error("Please add atleast one lecture in each section");
        return ;
      }
      // if everything is good,
      dispatch(setStep(3));
  }

  const onSubmit =async(data)=>{
    setLoading(true);
    let result;

    if(editSectionName){
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id,
      },token)
    }
    else{
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      },token)
    }

    // update values of course
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","")
    }

    // set loading false
    setLoading(false);

  }


  const handleChangeEditSectionName = (sectionId,sectionName)=>{
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);

  }

  return (
    <div className='text-white'>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName">Section Name <sup>*</sup></label>
          <input type="text"
            id="sectionName"
            name='sectionName'
            placeholder="Add Section Name"
            {...register("sectionName",{required:true})}
            className='w-full'
          />
          {errors.sectionName &&(
            <span>
              Section Name is required
            </span>
          )}
        </div> 
        <div className='mt-10 flex'>
          <IconBtn
          type="Submit"
          text={editSectionName ? "Edit Section Name":"Create Section"}
          outline={true}
          customClasses={"text-white"}>
              <CiCirclePlus className='text-yellow-100 text-2xl font-bold' />
          </IconBtn>
          {
            editSectionName &&(
              <button
              type='button'
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
              >
              Cancel Edit
              </button>
            )
          }
        </div>
      </form>

      {
        course.courseContent.length>0 && (
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>

        )
      }

      <div className='flex gap-x-3 justify-end mt-10'>
        <button
        onClick={goBack}
        className='rounded-md cursor-pointer flex items-center'
        >Back</button>

        <IconBtn 
        text="Next"
        onClick={goToNext}>
              <MdNavigateNext />
        </IconBtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm