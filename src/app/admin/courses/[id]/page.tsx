import React from "react";
import { CourseDetails } from "@/components/courses/CourseDetails";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

async function getCourse(id: string) {
  await connectDB();
  // Ensure models are registered for population
  const dummyInst = Instructor;
  const dummyCat = Category;

  const course = await Course.findById(id)
    .populate("instructors", "name image email")
    .populate("category", "name slug")
    .lean();

  if (!course) return null;

  return {
    ...course,
    _id: course._id.toString(),
    createdAt: course.createdAt?.toISOString(),
    updatedAt: course.updatedAt?.toISOString(),
    instructors:
      course.instructors?.map((inst: any) => ({
        ...inst,
        _id: inst._id.toString(),
      })) || [],
    // Flatten category to string for display to prevent React object error
    category: course.category ? course.category.name : "Uncategorized",
    chapters: course.chapters?.map((ch: any) => ({
      ...ch,
      _id: ch._id.toString(),
      videos: ch.videos?.map((v: any) => ({ ...v, _id: v._id.toString() })),
    })),
  };
}

export default async function CourseDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const course = await getCourse(params.id);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <CourseDetails course={course} />
    </div>
  );
}
