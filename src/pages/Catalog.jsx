import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { catalogData, categories } from '../services/apis';

const normalizeCategorySlug = (value = '') =>
  value.trim().toLowerCase().replace(/\s+/g, '-');

const formatCategoryName = (value = '') => value.trim();

const Catalog = () => {
  const { catalogName } = useParams();
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiConnector('GET', categories.CATEGORIES_API);
        const categoryList = response?.data?.data || [];
        setAllCategories(categoryList);

        if (!categoryList.length) {
          setSelectedCategory(null);
          return;
        }

        const requestedName = (catalogName || '').replace(/-/g, ' ');
        const matchedCategory =
          categoryList.find(
            (category) =>
              category.name.toLowerCase() === requestedName.toLowerCase()
          ) || categoryList[0];

        setSelectedCategory(matchedCategory);
      } catch (error) {
        console.log('Failed to fetch categories:', error);
        setAllCategories([]);
        setSelectedCategory(null);
      }
    };

    fetchCategories();
  }, [catalogName]);

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
        console.log('Failed to fetch catalog page data:', error);
        setCatalogPageData({});
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPage();
  }, [selectedCategory]);

  const activeCourses = useMemo(() => {
    if (!catalogPageData) return [];
    return catalogPageData.selectedCourses || catalogPageData.mostSellingCourses || [];
  }, [catalogPageData]);

  const otherCourses = useMemo(() => {
    if (!catalogPageData) return [];
    return catalogPageData.differentCourses || [];
  }, [catalogPageData]);

  const renderCourseCard = (course, index) => {
    const courseImage = course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80';
    const title = course?.courseName || course?.name || 'Untitled Course';
    const description =
      course?.courseDescription ||
      course?.description ||
      'Explore a guided learning path designed to help you master concepts faster.';
    const price = course?.price ?? 0;

    return (
      <div
        key={course?._id || `${title}-${index}`}
        className="overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 shadow-lg shadow-richblack-950/40 transition-all duration-200 hover:-translate-y-1"
      >
        <img src={courseImage} alt={title} className="h-48 w-full object-cover" />
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-yellow-50/10 px-2 py-1 text-xs font-medium text-yellow-50">
              {course?.tag?.[0] || 'Popular'}
            </span>
            <span className="text-sm font-semibold text-yellow-50">
              ₹{price}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="line-clamp-3 text-sm text-richblack-300">{description}</p>

          <div className="flex items-center justify-between text-xs text-richblack-400">
            <span>{course?.studentsEnrolled?.length || 0} students</span>
            <span>{course?.courseContent?.length || 0} lessons</span>
          </div>

          <Link
            to={`/view-course/${course?._id}`}
            className="mt-2 inline-flex items-center rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 transition hover:bg-yellow-100"
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
        <div className="rounded-3xl border border-richblack-700 bg-richblack-800 p-8 shadow-2xl shadow-richblack-950/40">
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-50">Catalog</p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            {selectedCategory?.name || 'Explore Courses'}
          </h1>
          <p className="mt-4 max-w-2xl text-richblack-300">
            {selectedCategory?.description ||
              'Browse our curated learning paths and discover the right course to accelerate your skill growth.'}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {allCategories.map((category) => {
            const isActive = selectedCategory?._id === category._id;
            const slug = normalizeCategorySlug(category.name);

            return (
              <Link
                key={category._id}
                to={`/catalog/${slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
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

        {loading ? (
          <div className="mt-16 grid min-h-[200px] place-items-center">
            <div className="spinner"></div>
          </div>
        ) : activeCourses.length > 0 ? (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Courses in this category</h2>
              <span className="text-sm text-richblack-300">{activeCourses.length} courses</span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activeCourses.map(renderCourseCard)}
            </div>
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-richblack-700 bg-richblack-800 p-10 text-center text-richblack-300">
            No courses available in this category yet.
          </div>
        )}

        {otherCourses.length > 0 && (
          <div className="mt-16">
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
