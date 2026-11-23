import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleBuyCourse = async () => {
    if (loadingRef.current) return

    const courses = cart.map((course) => course._id)
    loadingRef.current = true
    setLoading(true)
    try {
      await buyCourse(token, courses, user, navigate, dispatch)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text={loading ? "Opening Checkout..." : "Buy Now"}
        onclick={handleBuyCourse}
        disabled={loading}
        customClasses="w-full justify-center"
      >
        {loading && (
          <span
            aria-label="Loading"
            className="h-4 w-4 animate-spin rounded-full border-2 border-richblack-900 border-t-transparent"
          />
        )}
      </IconBtn>
    </div>
  )
}