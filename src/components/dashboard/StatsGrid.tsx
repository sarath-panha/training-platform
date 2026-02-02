import React from "react";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/types";

export const StatsGrid = ({ stats }: { stats: Stat[] }) => (
  <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {stats.map((stat) => (
      <Card
        key={stat.id}
        className="relative group hover:border-slate-400 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-slate-100 rounded-none text-slate-700">
            <stat.icon className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-none ${stat.trendUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
          >
            {stat.trend}
          </span>
        </div>
        <div>
          <h3 className="text-2xl sm:text-4xl font-light text-slate-900 tracking-tight">
            {stat.value}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {stat.label}
          </p>
        </div>
      </Card>
    ))}
  </section>
);
