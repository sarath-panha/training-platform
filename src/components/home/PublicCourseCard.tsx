"use client";

import React from "react";
import Link from "next/link";
import { Star, User, Clock } from "lucide-react";

interface PublicCourseCardProps {
  course: any;
}

export const PublicCourseCard = ({ course }: PublicCourseCardProps) => {
  const primaryInstructor = course.instructors?.[0];
  const instructorName =
    typeof primaryInstructor === "object"
      ? primaryInstructor.name
      : "Ecodent Instructor";

  return (
    <Link href={`/courses/${course._id}`} className="group block h-full">
      <div className="h-full border border-slate-200 bg-white hover:border-slate-400 transition-all duration-300 flex flex-col rounded-lg overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-video bg-slate-100 relative overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest">
                No Image
              </span>
            </div>
          )}
          {course.category && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold text-slate-900 uppercase tracking-wider rounded-sm">
              {typeof course.category === "object"
                ? course.category.name
                : course.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {instructorName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {course.courseIncludes?.hours || 0}h
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
            {course.shortDescription ||
              "Learn the fundamentals and advanced techniques in this comprehensive dental course."}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900">4.8</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-400 ml-1">(120)</span>
            </div>
            <span className="font-bold text-slate-900">
              {course.price ? `$${course.price}` : "Free"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
