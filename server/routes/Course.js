// Import the required modules
const express = require('express');
const router = express.Router();

// Import the controllers

// Course controllers Import
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/Course");

// Categories controllers Import
const {
    showAllCategory,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category");

// Sections controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section"); 

// Sub-Sections controllers Import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection"); 

// Rating controllers Import
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview");

const {
    updateCourseProgress
} = require("../controllers/courseProgress");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ***** Course routes *****
// Courses can only be created by instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// add a section to a course
router.post("/addSection", auth, isInstructor, createSection);
// update a section
router.post("/updateSection", auth, isInstructor, updateSection);
// delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// edit sub section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// delete sub section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// add a sub section to a section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// get all registered courses
router.get("/getAllCourses", getAllCourses);
// get details for a specific courses
router.post("/getCourseDetails", getCourseDetails);
// Get details for a specific courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ***** Categories routes *****
// Category can only be created by admin
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ***** Rating and Review routes *****
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;