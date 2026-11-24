import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RiDeleteBin6Line } from "react-icons/ri"

import ConfirmationModal from "../../common/ConfirmationModal"
import Pagination from "../../common/Pagination"
import { deleteCourse, fetchInstructorCourses } from "../../../services/courseDetailsAPI"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    let isCurrentRequest = true

    const loadCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token, currentPage, 10)

      if (isCurrentRequest) {
        const totalPages = result?.pagination?.totalPages || 0
        if (currentPage > Math.max(totalPages, 1)) {
          setCurrentPage(Math.max(totalPages, 1))
          setLoading(false)
          return
        }
        setCourses(result?.allCourses || [])
        setPagination(result?.pagination || null)
        setLoading(false)
      }
    }

    if (token) loadCourses()

    return () => {
      isCurrentRequest = false
    }
  }, [token, currentPage, refreshKey])

  const handleDeleteCourse = async (courseId) => {
    const deleted = await deleteCourse({ courseId }, token)
    setConfirmationModal(null)
    if (deleted) setRefreshKey((key) => key + 1)
  }

  return (
    <section className="text-richblack-5">
      <h1 className="text-3xl font-semibold">My Courses</h1>

      {loading && courses.length === 0 ? (
        <div className="grid min-h-[240px] place-items-center">
          <div className="spinner" />
        </div>
      ) : courses.length === 0 ? (
        <p className="mt-8 text-richblack-300">You have not created any courses yet.</p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-richblack-600 text-richblack-300">
                  <th scope="col" className="px-4 py-3 font-medium">Course</th>
                  <th scope="col" className="px-4 py-3 font-medium">Price</th>
                  <th scope="col" className="px-4 py-3 font-medium">Students</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">
                    {loading ? "Updating..." : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b border-richblack-700">
                    <td className="px-4 py-4 font-medium">
                      {course.courseName || "Untitled Course"}
                    </td>
                    <td className="px-4 py-4">₹{course.price ?? 0}</td>
                    <td className="px-4 py-4">
                      {course.studentsEnroled?.length || 0}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        aria-label={`Delete ${course.courseName || "course"}`}
                        title="Delete course"
                        onClick={() =>
                          setConfirmationModal({
                            text1: "Delete this course?",
                            text2: "This will remove the course and unenroll its students.",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDeleteCourse(course._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })
                        }
                        className="inline-flex items-center justify-center rounded p-2 text-richblack-300 transition hover:bg-pink-800/30 hover:text-pink-200"
                      >
                        <RiDeleteBin6Line aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination?.currentPage || currentPage}
            totalPages={pagination?.totalPages || 0}
            onPageChange={setCurrentPage}
            disabled={loading}
          />
        </>
      )}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </section>
  )
}