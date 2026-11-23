import React, { useState } from "react"
import ReactStars from "react-rating-stars-component"
import { FaStar } from "react-icons/fa"

import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider({ reviews: reviewsProp = [], pagination: paginationProp = null }) {
  const [reviews, setReviews] = useState(reviewsProp)
  const [pagination, setPagination] = useState(paginationProp)
  const [loadingMore, setLoadingMore] = useState(false)
  const truncateWords = 15

  const loadMoreReviews = async () => {
    if (!pagination?.hasNextPage || loadingMore) return

    setLoadingMore(true)
    try {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API,
        null,
        null,
        { limit: pagination.limit || 10, cursor: pagination.nextCursor }
      )

      if (data?.success) {
        setReviews((currentReviews) => [
          ...currentReviews,
          ...(Array.isArray(data?.data) ? data.data : []),
        ])
        setPagination(data?.pagination || null)
      }
    } catch (error) {
      console.error("Failed to fetch more reviews:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const validReviews = reviews.filter((review) => {
    const rating = Number(review?.rating)
    const text = review?.review?.trim()

    return !Number.isNaN(rating) && rating > 0 && text
  })

  if (validReviews.length === 0) {
    return null
  }

  return (
    <div className="text-white w-full">
      <div className="my-[50px] w-full max-w-maxContentTab lg:max-w-maxContent">
        <div className="flex gap-6 overflow-x-auto pb-2">
          {validReviews.map((review, i) => {
            const reviewText = review?.review || ""
            const truncatedReview =
              reviewText.split(" ").length > truncateWords
                ? `${reviewText
                    .split(" ")
                    .slice(0, truncateWords)
                    .join(" ")} ...`
                : reviewText

            return (
              <div
                key={i}
                className="min-w-[260px] flex-1 rounded-lg bg-richblack-800 p-4 text-[14px] text-richblack-25 shadow-sm shadow-richblack-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 font-medium text-richblack-25">
                  {truncatedReview}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">
                    {Number(review.rating).toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={Number(review.rating)}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {pagination?.hasNextPage && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={loadMoreReviews}
              disabled={loadingMore}
              className="rounded-md border border-richblack-500 px-4 py-2 text-sm font-medium text-richblack-50 transition hover:border-yellow-50 disabled:cursor-wait disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load more reviews"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider