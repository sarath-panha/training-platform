import React from "react";
import { Search } from "lucide-react";

export const Hero = () => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight mb-6">
            Advance your <span className="font-semibold">dental career</span>{" "}
            with expert-led courses.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
            Join thousands of dentists and technicians mastering new skills in
            Endodontics, Surgery, and Digital Dentistry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full rounded-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-500"
              />
            </div>
            <button className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
              Explore
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm font-medium text-slate-500">
            <span>Trusted by professionals from:</span>
            <div className="flex gap-6 opacity-60 grayscale">
              {/* Placeholders for logos */}
              <span className="font-bold text-slate-800 text-lg">DENTSPLY</span>
              <span className="font-bold text-slate-800 text-lg">
                Straumann
              </span>
              <span className="font-bold text-slate-800 text-lg">
                Invisalign
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
