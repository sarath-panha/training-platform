"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, Clock, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Course } from "@/types";

interface CoursesTableProps {
  courses: Course[];
  userRole: "admin" | "instructor";
}

export const CoursesTable = ({ courses, userRole }: CoursesTableProps) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to delete");
      } else {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs w-[35%]">
                Course Name
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Category
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Status
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">
                Price
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.length > 0 ? (
              courses.map((course) => {
                const isPublished = course.status === "Published";
                // Instructors cannot delete published courses
                const canDelete = userRole === "instructor" && !isPublished;

                // ROUTING LOGIC
                // Admin -> Review Page (Public-like view with controls)
                // Instructor -> Edit Page (Form view)
                const actionLink =
                  userRole === "admin"
                    ? `/admin/courses/${course._id}/review`
                    : `/instructor/courses/${course._id}/edit`;

                return (
                  <tr
                    key={course._id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-sm overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center`}
                        >
                          {(course as any).thumbnail ? (
                            <img
                              src={(course as any).thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-500">
                              IMG
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{" "}
                              {(course as any).courseIncludes?.hours || 0}h
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                        {typeof (course as any).category === "object"
                          ? (course as any).category.name
                          : "General"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge type={course.status}>{course.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-medium text-slate-700">
                      {(course as any).price
                        ? `$${(course as any).price}`
                        : "Free"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={actionLink}
                          className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
                          title={
                            userRole === "admin"
                              ? "Review Course"
                              : "Edit Course"
                          }
                        >
                          {userRole === "admin" ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <Edit className="w-4 h-4" />
                          )}
                        </Link>

                        {canDelete && (
                          <button
                            onClick={() => handleDelete(course._id)}
                            disabled={!!loadingId}
                            className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
