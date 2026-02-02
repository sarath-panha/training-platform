import React from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PublicCourseCard } from "@/components/home/PublicCourseCard";
import { Footer } from "@/components/layout/Footer";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

// Fetch courses server-side
async function getPopularCourses() {
  await connectDB();

  // Register models to avoid missing schema errors
  const instructorModel = Instructor;
  const categoryModel = Category;

  const courses = await Course.find({ status: "Published" })
    .populate("instructors", "name")
    .populate("category", "name") // Populate Category to get name
    .sort({ enrollments: -1 })
    .limit(4)
    .lean();

  // Serialize for React and Flatten Category
  return courses.map((course: any) => ({
    ...course,
    _id: course._id.toString(),
    createdAt: course.createdAt?.toISOString(),
    updatedAt: course.updatedAt?.toISOString(),
    instructors:
      course.instructors?.map((inst: any) => ({
        ...inst,
        _id: inst._id.toString(),
      })) || [],
    // FIX: Flatten category object to string to prevent "Objects are not valid as React child" error
    category: course.category ? course.category.name : "Uncategorized",
    chapters: [], // Don't need chapters for card view
  }));
}

export default async function HomePage() {
  const courses = await getPopularCourses();

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main>
        <Hero />
        <FeaturedCategories />

        {/* Popular Courses Section */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-light text-slate-900">
                  Popular Courses
                </h2>
                <p className="text-slate-500 mt-1">
                  Top-rated content selected by the community.
                </p>
              </div>
              <button className="text-sm font-bold text-slate-900 hover:text-blue-700 transition-colors uppercase tracking-wider">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <PublicCourseCard key={course._id} course={course} />
                ))
              ) : (
                <div className="col-span-4 py-12 text-center text-slate-400 border-2 border-dashed border-slate-200">
                  No courses available yet. Check back soon!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ready to elevate your dental practice?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of professionals and get unlimited access to
              top-tier dental education.
            </p>
            <a
              href="/auth"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors rounded-none"
            >
              Get Started for Free
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
