const Category = require("../models/Category");
const Course = require("../models/Course");
const { getOrSetCache, invalidateCache, CACHE_KEYS } = require("../utils/cache");

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);

		// Invalidate cached categories so navbar & dropdown get fresh list
		await invalidateCache(CACHE_KEYS.ALL_CATEGORIES);

		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
		// Cache for 1 hour (3600 seconds)
		const allCategorys = await getOrSetCache(CACHE_KEYS.ALL_CATEGORIES, 3600, async () => {
			return await Category.find(
				{},
				{ name: true, description: true }
			);
		});

		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;
		if (!categoryId) {
			return res.status(400).json({
				success: false,
				message: "Category ID is required",
			});
		}

		// Cache for 15 minutes (900 seconds)
		const cacheKey = CACHE_KEYS.CATEGORY_PAGE_DETAILS(categoryId);

		const resultData = await getOrSetCache(cacheKey, 900, async () => {
			// Get courses for the specified category
			const selectedCategory = await Category.findById(categoryId)
				.populate({
					path: "courses",
					match: { status: "Published" },
					populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
				})
				.exec();

			if (!selectedCategory) {
				return { notFound: true };
			}

			const selectedCourses = selectedCategory.courses || [];

			// Get courses for other categories
			const categoriesExceptSelected = await Category.find({
				_id: { $ne: categoryId },
			}).populate({
				path: "courses",
				match: { status: "Published" },
				populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
			});

			let differentCourses = [];
			for (const category of categoriesExceptSelected) {
				differentCourses.push(...category.courses);
			}

			// Get top-selling courses across all categories
			const allCategories = await Category.find().populate({
				path: "courses",
				match: { status: "Published" },
				populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
			});
			const allCourses = allCategories.flatMap((category) => category.courses);
			const mostSellingCourses = allCourses
				.sort((a, b) => b.sold - a.sold)
				.slice(0, 10);

			return {
				selectedCourses,
				differentCourses,
				mostSellingCourses,
			};
		});

		if (resultData?.notFound) {
			return res.status(404).json({ success: false, message: "Category not found" });
		}

		res.status(200).json({
			selectedCourses: resultData.selectedCourses,
			differentCourses: resultData.differentCourses,
			mostSellingCourses: resultData.mostSellingCourses,
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

//add course to category
exports.addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	try {
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if (category.courses.includes(courseId)) {
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.courses.push(courseId);
		await category.save();

		// Invalidate this category's cached page details and course details
		await invalidateCache(CACHE_KEYS.CATEGORY_PAGE_DETAILS(categoryId));
		await invalidateCache(CACHE_KEYS.COURSE_DETAILS(courseId));

		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};