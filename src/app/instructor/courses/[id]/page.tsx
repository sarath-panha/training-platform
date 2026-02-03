import React from "react";
import { PublicCurriculum } from "@/components/public/PublicCurriculum";
import { CourseDetails } from "@/components/courses/CourseDetails"; // Reusing existing Details Component or creating a wrapper
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

// Using the same layout as Admin Review for consistency,
// but tailored for the creator to just "Preview"
import { AdminReviewPanel } from "@/components/courses/AdminReviewPanel";

// Helper to serialize
const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

async function getCourse(id: string) {
  await connectDB();
  const i = Instructor;
  const c = Category;

  const course = await Course.findById(id)
    .populate("instructors", "name image bio")
    .populate("category", "name")
    .lean();

  if (!course) return null;
  return serialize(course);
}

export default async function InstructorCourseViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* We reuse the CourseDetails component which is built for the Admin/Public view.
         Since this is the Instructor view, we can wrap it or use it directly.
         The CourseDetails component already has an 'Edit' button that points to the correct edit URL.
      */}
      <div className="pt-8">
        <CourseDetails course={course} />
      </div>
    </div>
  );
}
