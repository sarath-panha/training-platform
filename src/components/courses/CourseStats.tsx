import React from "react";
import { Card } from "@/components/ui/Card";
import { BookOpen, Users, DollarSign, BarChart3 } from "lucide-react";

interface CourseStatsProps {
  courses: any[];
}

export const CourseStats = ({ courses }: CourseStatsProps) => {
  // Calculate real stats from the courses array
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.status === "Published").length;
  const totalStudents = courses.reduce(
    (acc, curr) => acc + (curr.enrollments || 0),
    0,
  );

  // Calculate estimated revenue based on current price * enrollments
  // (Note: For precise historical revenue, use the Analytics API/Enrollments table)
  const estimatedRevenue = courses.reduce((acc, curr) => {
    const price = Number(curr.price) || 0;
    const enrollments = Number(curr.enrollments) || 0;
    return acc + price * enrollments;
  }, 0);

  const avgPrice = totalCourses > 0 ? estimatedRevenue / totalCourses : 0;

  const stats = [
    {
      label: "Total Courses",
      value: totalCourses.toString(),
      trend: `${activeCourses} Published`,
      icon: BookOpen,
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      trend: "Across all courses",
      icon: Users,
    },
    {
      label: "Est. Revenue",
      value: `$${estimatedRevenue.toLocaleString()}`,
      trend: "Lifetime Value",
      icon: DollarSign,
    },
    {
      label: "Avg. Value",
      value: `$${avgPrice.toFixed(0)}`,
      trend: "Per Course",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <Card
          key={idx}
          className="p-5 flex flex-col justify-between h-32 hover:border-slate-400 transition-colors group"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-50 rounded-none group-hover:bg-slate-100 transition-colors">
              <stat.icon className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {stat.trend}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-light text-slate-900">{stat.value}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
