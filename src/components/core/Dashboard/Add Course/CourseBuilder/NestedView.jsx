import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx"
import { MdEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from "react-icons/ri"
import { BiSolidDownArrow } from "react-icons/bi"
import { AiOutlinePlus } from "react-icons/ai"
import SubSectionModal from './SubSectionModal'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { deleteSection, deleteSubSection } from '../../../../../services/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [addSubsection, setAddSubsection] = useState(null)
  const [viewSubsection, setViewSubsection] = useState(null)
  const [editSubsection, setEditSubsection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    )
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection(
      {
        subSectionId,
        sectionId,
        courseId: course._id,
      },
      token
    )
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  return (
    <div>
      <div className='mt-10 rounded-xl bg-richblack-700 p-6 px-8 gap-y-3'>
        {course?.courseContent?.map((section) => {
          return (
            <details key={section._id} open>
              <summary className='flex items-center justify-between gap-x-3 my-2 border-b-2'>
                <div className='flex items-center gap-x-3'>
                  <RxDropdownMenu />
                  <p className='text-white'>{section.sectionName}</p>
                </div>
                <div className='flex items-center gap-x-3 '>
                  <button
                    type="button"
                    onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                  >
                    <MdEdit />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Delete this section",
                        text2: "All the section in this will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteSection(section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }}
                  >
                    <RiDeleteBin6Line />
                  </button>
                  <span>|</span>
                  <button type="button"><BiSolidDownArrow /></button>
                </div>
              </summary>
              <div>
                {section.subSection.map((data) => {
                  return (
                    <div
                      key={data?._id}
                      onClick={() => setViewSubsection(data)}
                      className='flex items-center justify-between gap-x-3 border-b-2 cursor-pointer'
                    >
                      <div className='flex items-center gap-x-3'>
                        <RxDropdownMenu />
                        <p className='text-white'>{data.title}</p>
                      </div>
                      <div className='flex items-center justify-center gap-x-3' onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setEditSubsection({ ...data, sectionId: section._id })}
                        >
                          <MdEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmationModal({
                              text1: "Delete this Sub section",
                              text2: "Selected lecture will be deleted",
                              btn1Text: "Delete",
                              btn2Text: "Cancel",
                              btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                              btn2Handler: () => setConfirmationModal(null),
                            })
                          }}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>

                    </div>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setAddSubsection(section._id)}
                  className='mt-4 flex item-center gap-x-2 text-yellow-50'
                >
                  <AiOutlinePlus />
                  <p>Add Lecture</p>
                </button>
              </div>

            </details>
          )
        })}
      </div>
      {addSubsection ? (
        <SubSectionModal modalData={addSubsection} setModalData={setAddSubsection} add={true} />
      ) : viewSubsection ? (
        <SubSectionModal modalData={viewSubsection} setModalData={setViewSubsection} view={true} />
      ) : editSubsection ? (
        <SubSectionModal modalData={editSubsection} setModalData={setEditSubsection} edit={true} />
      ) : null}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default NestedView