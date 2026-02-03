import React from "react";
import { Eye, TrendingUp } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
  enrollments: number;
  price: number;
  category: any;
}

export const TopCoursesList = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-3 px-6 font-bold text-slate-500 uppercase text-xs">
              Course Name
            </th>
            <th className="py-3 px-6 font-bold text-slate-500 uppercase text-xs">
              Category
            </th>
            <th className="py-3 px-6 font-bold text-slate-500 uppercase text-xs text-right">
              Price
            </th>
            <th className="py-3 px-6 font-bold text-slate-500 uppercase text-xs text-right">
              Students
            </th>
            <th className="py-3 px-6 font-bold text-slate-500 uppercase text-xs text-right">
              Revenue Est.
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {courses.map((course) => (
            <tr
              key={course._id}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded overflow-hidden shrink-0 border border-slate-200">
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span
                    className="font-medium text-slate-900 line-clamp-1 max-w-[200px]"
                    title={course.title}
                  >
                    {course.title}
                  </span>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                  {typeof course.category === "object"
                    ? course.category.name
                    : "General"}
                </span>
              </td>
              <td className="py-4 px-6 text-right text-slate-600 font-mono">
                {course.price > 0 ? `$${course.price}` : "Free"}
              </td>
              <td className="py-4 px-6 text-right font-medium text-slate-900">
                {course.enrollments}
              </td>
              <td className="py-4 px-6 text-right font-medium text-emerald-600 font-mono">
                ${(course.enrollments * (course.price || 0)).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
