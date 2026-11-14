import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { catalogData, categories, courseEndpoints } from '../services/apis';
import { useDebounce } from '../hooks/useDebounce';
import { AiOutlineSearch, AiOutlineCloseCircle } from 'react-icons/ai';

const normalizeCategorySlug = (value = '') =>
  value.trim().toLowerCase().replace(/\s+/g, '-');

const formatCategoryName = (value = '') => value.trim();

const Catalog = () => {
  const { catalogName } = useParams();
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // null means "All Courses"
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [allPublishedCourses, setAllPublishedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state with debouncing
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 400);

  // 1. Fetch all categories and all courses on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catResponse, courseResponse] = await Promise.all([
          apiConnector('GET', categories.CATEGORIES_API),
          apiConnector('GET', courseEndpoints.GET_ALL_COURSE_API),
        ]);

        const categoryList = catResponse?.data?.data || [];
        setAllCategories(categoryList);

        const courseList = courseResponse?.data?.data || [];
        setAllPublishedCourses(courseList);

        // If URL has /catalog/:catalogName, select that category
        if (catalogName) {
          const requestedName = catalogName.replace(/-/g, ' ');
          const matched = categoryList.find(
            (c) => c.name.toLowerCase() === requestedName.toLowerCase()
          );
          setSelectedCategory(matched || null);
        } else {
          // General catalog: default to "All" (null)
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error('Failed to fetch catalog initial data:', error);
      }
    };

    fetchInitialData();
  }, [catalogName]);

  // 2. When a specific category is chosen, fetch its catalog page details
  useEffect(() => {
    const fetchCategoryPage = async () => {
      if (!selectedCategory?._id) {
        setCatalogPageData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await apiConnector('POST', catalogData.CATALOGPAGEDATA_API, {
          categoryId: selectedCategory._id,
        });
        setCatalogPageData(response?.data || {});
      } catch (error) {
        console.log('Category page data note:', error?.response?.data?.message || error.message);
        setCatalogPageData({});
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPage();
  }, [selectedCategory]);

  // 3. Compute base courses depending on whether a category is selected or "All"
  const baseCourses = useMemo(() => {
    if (!selectedCategory) {
      return allPublishedCourses;
    }
    return catalogPageData?.selectedCourses || [];
  }, [selectedCategory, allPublishedCourses, catalogPageData]);

  // 4. Apply debounced search filter on top of the selected category or all courses
  const filteredCourses = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return baseCourses;
    }

    const term = debouncedSearchTerm.toLowerCase();
    return baseCourses.filter((course) => {
      const nameMatch = (course?.courseName || '').toLowerCase().includes(term);
      const descMatch = (course?.courseDescription || '').toLowerCase().includes(term);
      const tagMatch = Array.isArray(course?.tag)
        ? course.tag.some((t) => (t || '').toLowerCase().includes(term))
        : (course?.tag || '').toLowerCase().includes(term);

      return nameMatch || descMatch || tagMatch;
    });
  }, [baseCourses, debouncedSearchTerm]);

  const otherCourses = useMemo(() => {
    if (!selectedCategory || !catalogPageData) return [];
    return catalogPageData.differentCourses || [];
  }, [selectedCategory, catalogPageData]);

  const renderCourseCard = (course, index) => {
    const courseImage =
      course?.thumbnail ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80';
    const title = course?.courseName || course?.name || 'Untitled Course';
    const description =
      course?.courseDescription ||
      course?.description ||
      'Explore a guided learning path designed to help you master concepts faster.';
    const price = course?.price ?? 0;

    return (
      <div
        key={course?._id || `${title}-${index}`}
        className="overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 shadow-lg shadow-richblack-950/40 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
      >
        <div>
          <img src={courseImage} alt={title} className="h-48 w-full object-cover" />
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-yellow-50/10 px-2 py-1 text-xs font-medium text-yellow-50">
                {Array.isArray(course?.tag) ? course?.tag[0] : course?.tag || 'Popular'}
              </span>
              <span className="text-sm font-semibold text-yellow-50">₹{price}</span>
            </div>

            <h3 className="text-xl font-semibold text-white line-clamp-1">{title}</h3>
            <p className="line-clamp-2 text-sm text-richblack-300">{description}</p>

            <div className="flex items-center justify-between text-xs text-richblack-400">
              <span>{course?.studentsEnrolled?.length || 0} students</span>
              <span>{course?.courseContent?.length || 0} lessons</span>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <Link
            to={`/courses/${course?._id}`}
            className="w-full inline-flex justify-center items-center rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 transition hover:bg-yellow-100"
          >
            View Course
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      <div className="mx-auto w-11/12 max-w-maxContent py-12">
        {/* Header Hero Section */}
        <div className="rounded-3xl border border-richblack-700 bg-richblack-800 p-8 shadow-2xl shadow-richblack-950/40">
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-50">Course Catalog</p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            {selectedCategory?.name || 'Explore All Courses'}
          </h1>
          <p className="mt-4 max-w-2xl text-richblack-300">
            {selectedCategory?.description ||
              'Browse our entire course library across all disciplines. Search by title, keywords, or filter by category.'}
          </p>

          {/* Interactive Debounced Search Bar */}
          <div className="mt-6 relative max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search courses by title, keywords, tags..."
              className="w-full rounded-full bg-richblack-900 border border-richblack-700 py-3 pl-11 pr-10 text-sm text-richblack-5 placeholder-richblack-400 focus:border-yellow-50 focus:outline-none transition shadow-inner"
            />
            <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-400 text-lg" />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-richblack-100 transition"
                title="Clear search"
              >
                <AiOutlineCloseCircle className="text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {/* "All Categories" pill */}
          <Link
            to="/catalog"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              selectedCategory === null
                ? 'border-yellow-50 bg-yellow-50 text-richblack-900'
                : 'border-richblack-700 bg-richblack-800 text-richblack-200 hover:border-richblack-500'
            }`}
          >
            All Courses
          </Link>

          {allCategories.map((category) => {
            const isActive = selectedCategory?._id === category._id;
            const slug = normalizeCategorySlug(category.name);

            return (
              <Link
                key={category._id}
                to={`/catalog/${slug}`}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-yellow-50 bg-yellow-50 text-richblack-900'
                    : 'border-richblack-700 bg-richblack-800 text-richblack-200 hover:border-richblack-500'
                }`}
              >
                {formatCategoryName(category.name)}
              </Link>
            );
          })}
        </div>

        {/* Course Grid Results */}
        {loading ? (
          <div className="mt-16 grid min-h-[200px] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">
                {debouncedSearchTerm
                  ? `Search results for "${debouncedSearchTerm}"`
                  : selectedCategory
                  ? `Courses in ${selectedCategory.name}`
                  : 'All Courses'}
              </h2>
              <span className="text-sm text-richblack-300">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map(renderCourseCard)}
            </div>
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-richblack-700 bg-richblack-800 p-10 text-center text-richblack-300">
            {debouncedSearchTerm ? (
              <p>
                No courses matched your search for{' '}
                <span className="text-yellow-50 font-semibold">"{debouncedSearchTerm}"</span>.
              </p>
            ) : (
              <p>No courses available in this selection yet.</p>
            )}
          </div>
        )}

        {/* Other Courses Recommendation section (when inside a specific category) */}
        {selectedCategory && otherCourses.length > 0 && !debouncedSearchTerm && (
          <div className="mt-16 border-t border-richblack-800 pt-12">
            <h2 className="mb-6 text-2xl font-semibold text-white">More courses to explore</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {otherCourses.slice(0, 6).map(renderCourseCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
