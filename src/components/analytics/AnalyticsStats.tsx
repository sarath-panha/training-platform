import React from "react";
import { DollarSign, Users, BookOpen, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface StatsProps {
  summary: {
    revenue: number;
    enrollments: number;
    users: number;
    instructors: number;
  };
}

export const AnalyticsStats = ({ summary }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500 bg-white">
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Revenue
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            ${summary.revenue.toLocaleString()}
          </h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-blue-500 bg-white">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Students
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {summary.users.toLocaleString()}
          </h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-indigo-500 bg-white">
        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Enrollments
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {summary.enrollments.toLocaleString()}
          </h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 border-l-4 border-l-slate-500 bg-white">
        <div className="p-3 bg-slate-100 rounded-full text-slate-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Instructors
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {summary.instructors}
          </h3>
        </div>
      </Card>
    </div>
  );
};
