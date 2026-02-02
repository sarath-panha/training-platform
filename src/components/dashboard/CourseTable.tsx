import React from "react";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Course } from "@/types";

export const CourseTable = ({ courses }: { courses: Course[] }) => (
  <div className="bg-white border border-slate-200">
    {/* Table Header (Hidden on mobile) */}
    <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
      <div className="col-span-6">Course Details</div>
      <div className="col-span-2 text-center">Status</div>
      <div className="col-span-2 text-center">Students</div>
      <div className="col-span-2 text-right">Revenue</div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-slate-100">
      {courses.map((course) => (
        <div
          key={course.id}
          className="p-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center hover:bg-slate-50 transition-colors group"
        >
          {/* Course Info */}
          <div className="col-span-6 flex items-start gap-4 mb-4 sm:mb-0">
            <div
              className={`w-12 h-12 ${course.thumbnailColor} flex items-center justify-center shrink-0`}
            >
              <Layers className="w-6 h-6 text-slate-900/40" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                {course.category}
              </span>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {course.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {course.instructor}
              </p>
            </div>
          </div>

          {/* Status (Mobile: Inline, Desktop: Grid) */}
          <div className="col-span-2 flex items-center justify-between sm:justify-center mb-2 sm:mb-0">
            <span className="sm:hidden text-xs font-medium text-slate-500">
              Status
            </span>
            <Badge type={course.status}>{course.status}</Badge>
          </div>

          {/* Enrollments */}
          <div className="col-span-2 flex items-center justify-between sm:justify-center mb-2 sm:mb-0">
            <span className="sm:hidden text-xs font-medium text-slate-500">
              Enrolled
            </span>
            <span className="text-sm font-medium text-slate-700">
              {course.enrollments}
            </span>
          </div>

          {/* Revenue */}
          <div className="col-span-2 flex items-center justify-between sm:justify-end">
            <span className="sm:hidden text-xs font-medium text-slate-500">
              Total Revenue
            </span>
            <span className="text-sm font-bold text-slate-900">
              {course.revenue}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
