import React from "react";
import Link from "next/link";
import { Search, Filter, Plus } from "lucide-react";

export const CourseHeader = () => (
  <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
    <div>
      <h2 className="text-2xl font-light text-slate-900">Course Management</h2>
      <p className="text-slate-500 text-sm mt-1">
        Create, edit, and manage your educational content.
      </p>
    </div>

    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full rounded-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-400"
        />
      </div>
      <div className="flex gap-2">
        <button className="h-[42px] px-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-colors">
          <Filter className="w-4 h-4" /> <span>Filters</span>
        </button>
        <Link
          href="/admin/courses/new"
          className="h-[42px] px-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> <span>Add Course</span>
        </Link>
      </div>
    </div>
  </div>
);
