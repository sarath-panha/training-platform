import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CoursesTable } from "@/components/courses/CoursesTable";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

async function getCourses() {
  await connectDB();
  const dummyInst = Instructor;
  const dummyCat = Category;

  const coursesRaw = await Course.find({})
    .populate("instructors", "name image")
    .sort({ createdAt: -1 })
    .lean();

  const categoriesRaw = await Category.find({}).lean();
  const categoryMapById = new Map(
    categoriesRaw.map((c: any) => [c._id.toString(), c]),
  );

  return coursesRaw.map((course: any) => {
    let categoryData = null;
    if (course.category && categoryMapById.has(course.category.toString())) {
      categoryData = categoryMapById.get(course.category.toString());
    }

    return {
      ...course,
      id: course._id.toString(),
      _id: course._id.toString(),
      createdAt: course.createdAt?.toISOString(),
      updatedAt: course.updatedAt?.toISOString(),
      instructors:
        course.instructors?.map((inst: any) => ({
          ...inst,
          _id: inst._id.toString(),
        })) || [],
      category: categoryData
        ? { ...categoryData, _id: categoryData._id?.toString() }
        : null,
      chapters: [],
    };
  });
}

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);
  const courses = await getCourses();

  // Safe cast since middleware/layout protects this page for admins usually
  const userRole = (session?.user as any)?.role || "admin";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            Course Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Review, approve, and manage platform content.
          </p>
        </div>
        {/* Admin cannot create courses, so no Add button here */}
      </div>

      <CoursesTable courses={courses} userRole={userRole} />
    </div>
  );
}
