const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// Create category ka handler function
exports.createCategory = async (req, res) => {
    try {
        // fetch data
        const {name, description} = req.body;
        
        // Validation
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, please filled all fields",
            });
        }

        // Create entry in DB
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);

        // return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "There is an error in making the category, Error: " + error.message,
        });
    }
}

// getAllCategory handler function
exports.showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success:true,
            message: "All categories returned successfully",
            data: allCategory,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "There is an error in fetching the categories, Error: " + error.message,
        });
    }
}

// categoryPageDetails handler function
exports.categoryPageDetails = async (req, res) => {
    try {
        // get categoryId
        const {categoryId} = req.body;
        // get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
        })
        .exec();
        // validation
        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        // Handle the case when there are no courses
        if(selectedCategory.courses.length === 0) {
            // console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }
        // get courses for different categories
        const categoriesExceptSelected = await Category.find({
                                    _id: {$ne: categoryId},
                                    });
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
                                    )
                                    .populate({
                                    Path: "courses",
                                    match: { status: "Published"}
                                    })
                                    .exec();
        //TODO: get top 10 selling courses across all categories
        const allCategories = await Category.find()
                                            .populate({
                                                path: "courses",
                                                match: { status: "Published" },
                                                populate: {
                                                    path: "instructor",
                                                },
                                            })
                                            .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            message: error.message,
        });
    }
}