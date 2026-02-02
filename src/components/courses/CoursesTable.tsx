import React from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Clock, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Course } from "@/types";

const getInstructorInfo = (instructorData: any) => {
  if (!instructorData) return null;
  if (typeof instructorData === "object" && "name" in instructorData) {
    return instructorData;
  }
  return { name: "Unknown", _id: instructorData };
};

export const CoursesTable = ({ courses }: { courses: Course[] }) => (
  <div className="bg-white border border-slate-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs w-[35%]">
              Course Name
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Instructor
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
            courses.map((course) => (
              <tr
                key={course._id}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {(course as any).thumbnail ? (
                      <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={(course as any).thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-10 h-10 ${(course as any).thumbnailColor || "bg-slate-100"} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-xs font-bold text-slate-700">
                          NA
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {(course as any).courseIncludes?.hours || 0}h
                        </span>
                        {/* Dynamic Category Name */}
                        <span className="flex items-center gap-1">
                          <BarChart className="w-3 h-3" />
                          {typeof (course as any).category === "object"
                            ? (course as any).category.name
                            : "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const firstRaw = (course as any).instructors?.[0];
                      const firstInst = getInstructorInfo(firstRaw);
                      if (!firstInst)
                        return (
                          <span className="text-slate-400 text-xs">
                            Unassigned
                          </span>
                        );
                      return (
                        <>
                          {firstInst.image ? (
                            <img
                              src={firstInst.image}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {firstInst.name.slice(0, 2)}
                            </div>
                          )}
                          <span className="font-medium text-slate-700">
                            {firstInst.name}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge type={course.status}>{course.status}</Badge>
                </td>
                <td className="py-4 px-6 text-right font-mono font-medium text-slate-700">
                  {(course as any).price ? `$${(course as any).price}` : "Free"}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/courses/${course._id}`}
                      className="p-2 hover:bg-slate-200 rounded-full"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/courses/${course._id}/edit`}
                      className="p-2 hover:bg-slate-200 rounded-full"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
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
