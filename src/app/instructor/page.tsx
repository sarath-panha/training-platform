"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export default function InstructorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/instructor/dashboard");
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex h-[50vh] justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center">
        Failed to load data. Ensure your instructor profile is active.
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-slate-900">
            Instructor Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Overview of your courses and student performance.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/instructor/courses")}
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Manage Courses
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              My Courses
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.stats.courses}
            </h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              ${data.stats.revenue.toLocaleString()}
            </h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.stats.students}
            </h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-50 rounded-full text-amber-600">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg. Rating
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.stats.rating}
            </h3>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Recent Enrollments
            </h3>
            <div className="space-y-4">
              {data.recentActivity.map((activity: any) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      {activity.user?.name?.slice(0, 2) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {activity.user?.name || "Unknown Student"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Enrolled in{" "}
                        <span className="font-medium text-indigo-600">
                          {activity.course?.title}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(activity.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {data.recentActivity.length === 0 && (
                <p className="text-center text-slate-400 py-4">
                  No recent activity.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6 bg-indigo-900 text-white border-none">
            <h3 className="text-lg font-medium mb-2">Instructor Tips</h3>
            <p className="text-indigo-200 text-sm mb-4">
              Engage with your students by replying to reviews and updating your
              course content regularly.
            </p>
            <div className="space-y-2">
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors text-left px-4 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Update Profile
              </button>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors text-left px-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> View Analytics
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
