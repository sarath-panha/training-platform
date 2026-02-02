import React from "react";
import { CourseForm } from "@/components/courses/CourseForm";
import connectDB from "@/lib/db";
import Course from "@/models/Course";

async function getCourse(id: string) {
  await connectDB();
  const course = await Course.findById(id).lean();

  if (!course) return null;

  return {
    ...course,
    _id: course._id.toString(),
    createdAt: course.createdAt?.toISOString(),
    updatedAt: course.updatedAt?.toISOString(),
    // Serialize instructors IDs
    instructors: course.instructors?.map((id: any) => id.toString()) || [],
    // FIX: Serialize Category ID (handle potential null/undefined)
    category: course.category ? course.category.toString() : "",
    chapters: course.chapters?.map((ch: any) => ({
      ...ch,
      _id: ch._id.toString(),
      videos: ch.videos?.map((v: any) => ({ ...v, _id: v._id.toString() })),
    })),
  };
}

export default async function EditCoursePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const course = await getCourse(params.id);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <CourseForm initialData={course} />
    </div>
  );
}
