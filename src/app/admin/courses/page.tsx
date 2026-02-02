import React from "react";
import { CourseStats } from "@/components/courses/CourseStats";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { CoursesTable } from "@/components/courses/CoursesTable";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

async function getCourses() {
  await connectDB();

  // Register models
  const dummyInst = Instructor;
  const dummyCat = Category;

  // 1. Fetch courses WITHOUT populating category to prevent CastError on legacy string data
  const coursesRaw = await Course.find({})
    .populate("instructors", "name image")
    .sort({ createdAt: -1 })
    .lean();

  // 2. Fetch categories separately for manual mapping
  const categoriesRaw = await Category.find({}).lean();

  // Create lookups for both ID and Name (to handle legacy string categories)
  const categoryMapById = new Map(
    categoriesRaw.map((c: any) => [c._id.toString(), c]),
  );
  const categoryMapByName = new Map(categoriesRaw.map((c: any) => [c.name, c]));

  // 3. Serialize and manually join category data
  return coursesRaw.map((course: any) => {
    let categoryData = null;
    const catVal = course.category;

    if (catVal) {
      // Check if it matches a Category ID
      if (categoryMapById.has(catVal.toString())) {
        categoryData = categoryMapById.get(catVal.toString());
      }
      // Check if it matches a Category Name (Legacy Data)
      else if (typeof catVal === "string" && categoryMapByName.has(catVal)) {
        categoryData = categoryMapByName.get(catVal);
      }
      // Fallback: If it's a string but no matching category exists, display as is
      else if (typeof catVal === "string") {
        categoryData = { name: catVal };
      }
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
      chapters:
        course.chapters?.map((ch: any) => ({
          ...ch,
          _id: ch._id.toString(),
          videos: ch.videos?.map((v: any) => ({ ...v, _id: v._id.toString() })),
        })) || [],
    };
  });
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <CourseHeader />
      <CourseStats />
      <CoursesTable courses={courses} />
    </div>
  );
}
