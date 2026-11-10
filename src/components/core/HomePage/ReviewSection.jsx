import React, { useEffect, useState } from "react"

import ReviewSlider from "../../common/ReviewSlider"
import { apiConnector } from "../../../services/apiconnector"
import { ratingsEndpoints } from "../../../services/apis"

const ReviewSection = () => {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )

        if (data?.success) {
          setReviews(data?.data || [])
        }
      } catch (error) {
        setReviews([])
      }
    })()
  }, [])

  const validReviews = reviews.filter((review) => {
    const rating = Number(review?.rating)
    const text = review?.review?.trim()

    return !Number.isNaN(rating) && rating > 0 && text
  })

  if (validReviews.length === 0) {
    return null
  }

  return (
    <div className="mt-20 w-full">
      <div className="flex flex-col max-w-maxContent gap-6 items-center mx-auto">
        <div className="text-4xl text-center text-white">
          Reviews from other learners
        </div>
        <ReviewSlider reviews={validReviews} />
      </div>
    </div>
  )
}

export default ReviewSection