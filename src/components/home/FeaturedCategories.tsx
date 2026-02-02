import React from "react";
import { Activity, Cpu, Stethoscope, Smile, Shield } from "lucide-react";

const CATEGORIES = [
  { name: "Endodontics", icon: Activity, count: "12 Courses" },
  { name: "Digital Dentistry", icon: Cpu, count: "8 Courses" },
  { name: "Oral Surgery", icon: Stethoscope, count: "15 Courses" },
  { name: "Orthodontics", icon: Smile, count: "10 Courses" },
  { name: "Periodontics", icon: Shield, count: "6 Courses" },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-light text-slate-900 mb-8">
          Top Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className="p-6 border border-slate-200 hover:border-slate-400 transition-colors group text-left bg-white"
            >
              <cat.icon className="w-8 h-8 text-slate-400 group-hover:text-slate-900 mb-4 transition-colors" />
              <h3 className="font-bold text-slate-900">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
