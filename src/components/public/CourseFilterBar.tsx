"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "All",
  "Endodontics",
  "Orthodontics",
  "Surgery",
  "Prosthodontics",
  "Pediatric",
  "Periodontics",
  "Digital Dentistry",
];

export const CourseFilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("q") || "";

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("q", term);
    else params.delete("q");
    router.push(`/courses?${params.toString()}`);
  };

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") params.delete("category");
    else params.set("category", category);
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            defaultValue={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for courses, topics, or instructors..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-full shadow-sm"
          />
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors rounded-full flex items-center gap-2 shadow-sm">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`
              px-4 py-2 text-sm font-medium rounded-full transition-all border
              ${
                currentCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
