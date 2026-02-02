import React from "react";
import { CourseForm } from "@/components/courses/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <CourseForm />
    </div>
  );
}
