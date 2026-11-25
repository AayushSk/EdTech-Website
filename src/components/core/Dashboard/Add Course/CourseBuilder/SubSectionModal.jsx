import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from 'react-icons/rx'
import IconBtn from '../../../../common/IconBtn'
import Upload from '../Upload'
import { createSubSection, updateSubSection } from '../../../../../services/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'

const SubSectionModal = ({ modalData, setModalData, add = false, view = false, edit = false }) => {
  const dispatch = useDispatch()
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      lectureTitle: edit ? modalData.title : "",
      lectureDesc: edit ? modalData.description : "",
    },
  })

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
    }
  }, [edit, view, modalData, setValue])

  const onSubmit = async (data) => {
    if (loadingRef.current) return

    loadingRef.current = true
    setLoading(true)
    try {
      let result = null
      const formData = new FormData()
      formData.append("sectionId", typeof modalData === "string" ? modalData : modalData.sectionId)
      formData.append("title", data.lectureTitle)
      formData.append("description", data.lectureDesc)
      formData.append("courseId", course._id)

      if (data.lectureVideo) {
        formData.append("videoFile", data.lectureVideo)
      }

      if (add) {
        result = await createSubSection(formData)
      } else if (edit) {
        formData.append("SubsectionId", modalData._id)
        result = await updateSubSection(formData)
      }

      if (result) {
        dispatch(setCourse(result))
        setModalData(null)
      }
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view ? "Viewing Lecture" : add ? "Adding Lecture" : "Editing Lecture"}
          </p>
          <button onClick={() => setModalData(null)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: !view })}
              disabled={view}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs text-pink-200">Lecture Title is required</span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: !view })}
              disabled={view}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs text-pink-200">Lecture Description is required</span>
            )}
          </div>

          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData?.videoUrl : null}
            editData={edit ? modalData?.videoUrl : null}
            required={add}
          />

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                type="submit"
                disabled={loading}
                text={loading ? "Saving..." : "Save Lecture"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default SubSectionModal