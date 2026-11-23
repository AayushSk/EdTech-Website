import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import Pagination from "../../common/Pagination"
import { fetchInstructorCourses } from "../../../services/courseDetailsAPI"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isCurrentRequest = true

    const loadCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token, currentPage, 10)

      if (isCurrentRequest) {
        setCourses(result?.allCourses || [])
        setPagination(result?.pagination || null)
        setLoading(false)
      }
    }

    if (token) loadCourses()

    return () => {
      isCurrentRequest = false
    }
  }, [token, currentPage])

  return (
    <section className="text-richblack-5">
      <h1 className="text-3xl font-semibold">My Courses</h1>

      {loading ? (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination?.currentPage || currentPage}
            totalPages={pagination?.totalPages || 0}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  )
}