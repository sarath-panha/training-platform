"use client";

import React, { useEffect, useState } from "react";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { SimpleBarChart } from "@/components/analytics/SimpleBarChart";
import { TopCoursesList } from "@/components/analytics/TopCoursesList";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
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
        console.error("Failed to load analytics", error);
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

  if (!data) return <div className="p-8 text-center">Failed to load data.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen space-y-8">
      <div>
        <h2 className="text-2xl font-light text-slate-900">
          Analytics Dashboard
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Platform performance and revenue insights.
        </p>
      </div>

      {/* Top Stats Cards */}
      <AnalyticsStats summary={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart: Revenue Trend */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Revenue Trend (6 Months)
            </h3>
            <SimpleBarChart data={data.chartData} />
          </Card>
        </div>

        {/* Side Widget: Growth */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white border-none h-full">
            <h3 className="text-lg font-medium mb-2">Growth Insight</h3>
            <p className="text-slate-400 text-sm mb-4">
              You have acquired{" "}
              <span className="text-white font-bold">
                {data.summary.users} new students
              </span>
              . Keep adding high-quality content to maintain retention.
            </p>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-3/4"></div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">
              Target: 1,000 Users
            </p>
          </Card>
        </div>
      </div>

      {/* Top Courses Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            Top Performing Courses
          </h3>
        </div>
        <TopCoursesList courses={data.topCourses} />
      </Card>
    </div>
  );
}
