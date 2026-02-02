"use client";

import { Users, Plus, ChevronRight } from "lucide-react";

// Components
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { CourseTable } from "@/components/dashboard/CourseTable";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

// Data
import { COURSES, STATS, PENDING_TASKS } from "@/data/mockData";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Action Section */}
      <section className="flex flex-col md:flex-row gap-6 md:items-center justify-between py-2">
        <div>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">
            Platform <span className="font-semibold">Overview</span>
          </h2>
          <p className="text-slate-500 mt-2">
            Manage content, users, and system performance.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" /> Invite Instructor
          </button>
          <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </div>
      </section>

      {/* Widgets */}
      <StatsGrid stats={STATS} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-normal text-slate-900">
              Recent Courses
            </h3>
            <button className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 uppercase tracking-wide">
              View All Courses <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <CourseTable courses={COURSES} />
        </div>

        <div className="space-y-6">
          <TasksWidget tasks={PENDING_TASKS} />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
