import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component"
import { AiOutlineStar, AiTwotoneStar } from 'react-icons/ai'
import {RiDeleteBin6Line} from 'react-icons/ri'
import { removeFromCart } from '../../../../slices/cartSlice'
const RenderCartCourses = () => {
    const {cart}= useSelector((state)=>state.cart)
    const dispatch= useDispatch();
  return (
    <div>
        {
            cart.map((course,index)=>{
                <div>
                    <div>
                        <img src={course?.thumbnail} alt="" />
                        <div> 
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>4.8</span>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<AiTwotoneStar/>}
                                    fullIcon={<AiTwotoneStar/>}
                                />
                                <span>{course?.ratingAndReviews?.length} Rating</span>
                            </div> 
                        </div>
                    </div>
                    <div>
                        <button onCLick={()=>dispatch(removeFromCart(course._id))}>
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>

                        <p>Rs {course?.price}</p>
                    </div>
                </div>
            })
        }
    </div>
  )
}

export default RenderCartCourses