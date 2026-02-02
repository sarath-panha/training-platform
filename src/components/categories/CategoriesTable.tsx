import React from "react";
import Link from "next/link";
import { Edit, Trash2, Folder, BookOpen } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  courseCount: number;
}

export const CategoriesTable = ({ categories }: { categories: Category[] }) => (
  <div className="bg-white border border-slate-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Name
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Slug
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Description
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
              Courses
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <tr
                key={cat._id}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-sm text-slate-500">
                      <Folder className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{cat.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                  {cat.slug}
                </td>
                <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                  {cat.description}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                    <BookOpen className="w-3 h-3" /> {cat.courseCount || 0}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/categories/${cat._id}/edit`}
                      className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
