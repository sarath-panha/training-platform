import React from "react";
import { Card } from "@/components/ui/Card";
import { BookOpen, Users, DollarSign, Star } from "lucide-react";

const stats = [
  {
    label: "Total Courses",
    value: "24",
    trend: "+2 this month",
    icon: BookOpen,
  },
  {
    label: "Active Students",
    value: "2,405",
    trend: "+12% growth",
    icon: Users,
  },
  {
    label: "Course Revenue",
    value: "$124.5k",
    trend: "Avg. $50/student",
    icon: DollarSign,
  },
  { label: "Avg. Rating", value: "4.8", trend: "From 560 reviews", icon: Star },
];

export const CourseStats = () => (
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
