"use client";

import React, { useEffect, useState } from "react";
import { CoursesTable } from "@/components/courses/CoursesTable";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/instructor/courses");
        if (res.ok) {
          setCourses(await res.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-light text-slate-900">My Courses</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage and edit your educational content.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/courses/new"
            className="h-[42px] px-4 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm rounded-full"
          >
            <Plus className="w-4 h-4" /> <span>Create New Course</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <CoursesTable courses={courses} />
      )}
    </div>
  );
}
