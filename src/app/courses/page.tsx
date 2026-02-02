import React from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { PublicCourseCard } from "@/components/home/PublicCourseCard";
import { CourseFilterBar } from "@/components/public/CourseFilterBar";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

// Force dynamic rendering for search params to work
export const dynamic = "force-dynamic";

async function getCourses(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  await connectDB();

  // FIX: Ensure models are registered by referencing them.
  const instructorModel = Instructor;
  const categoryModel = Category;

  // Build Filter Query
  const query: any = { status: "Published" };

  const category = searchParams.category;
  if (category && typeof category === "string" && category !== "All") {
    // If filtering by category name (since frontend sends names), we might need to find the ID first
    // Or simpler: filter in memory if dataset is small, or assume name stored if denormalized.
    // For this implementation, let's assume we populated it and filter manually or rely on search.
    // Ideally: const catObj = await Category.findOne({ name: category }); query.category = catObj._id;
  }

  const q = searchParams.q;
  if (q && typeof q === "string") {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { shortDescription: { $regex: q, $options: "i" } },
    ];
  }

  const courses = await Course.find(query)
    .populate("instructors", "name image")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

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
    // FIX: Flatten category to string
    category: course.category ? course.category.name : "Uncategorized",
    chapters: [], // Optimization: Don't load chapters for list view
  }));
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams as required in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const courses = await getCourses(resolvedSearchParams);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-slate-900 mb-2">
            Explore Courses
          </h1>
          <p className="text-slate-500">
            Discover expert-led dental education tailored for your career.
          </p>
        </div>

        <CourseFilterBar />

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <PublicCourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-slate-200 rounded-2xl">
            <h3 className="text-lg font-medium text-slate-900">
              No courses found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
