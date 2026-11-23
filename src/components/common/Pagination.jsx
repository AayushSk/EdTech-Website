import React from "react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) {
    return null
  }

  const firstPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const lastPage = Math.min(totalPages, firstPage + 4)

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded border border-richblack-600 px-3 py-2 text-richblack-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {Array.from({ length: lastPage - firstPage + 1 }, (_, index) => {
        const page = firstPage + index

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`min-w-10 rounded border px-3 py-2 ${
              page === currentPage
                ? "border-yellow-50 bg-yellow-50 text-richblack-900"
                : "border-richblack-600 text-richblack-100 hover:border-richblack-300"
            }`}
          >
            {page}
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded border border-richblack-600 px-3 py-2 text-richblack-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination