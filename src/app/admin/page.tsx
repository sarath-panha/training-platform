"use client";

import React, { useEffect, useState } from "react";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { SimpleBarChart } from "@/components/analytics/SimpleBarChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!data)
    return <div className="p-8 text-center">Failed to load dashboard.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Action Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">
            Platform <span className="font-semibold">Overview</span>
          </h2>
          <p className="text-slate-500 mt-2">
            Welcome back! Here is what is happening with your courses today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = "/admin/courses/new")}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors shadow-sm"
          >
            + Create New Course
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <AnalyticsStats summary={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Revenue Overview
            </h3>
            <SimpleBarChart data={data.chartData} />
          </Card>
        </div>

        {/* Recent Sales Feed */}
        <div className="space-y-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Recent Sales
            </h3>
            <RecentSales sales={data.recentEnrollments || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
