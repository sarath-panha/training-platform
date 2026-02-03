import React from "react";
import Link from "next/link";
import { GraduationCap, Calendar, ArrowRight } from "lucide-react";

export const RoleCallToAction = () => {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">
            Join our professional community
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Whether you want to share your expertise or host dental events,
            Ecodent provides the tools you need to grow your impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Instructor CTA */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Become an Instructor</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Create courses, mentor students, and earn revenue by sharing your
              dental knowledge.
            </p>
            <Link
              href="/apply/instructor"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-indigo-400 transition-colors"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Organizer CTA */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Become an Organizer</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Host workshops, seminars, and conferences. Manage registrations
              and ticketing seamlessly.
            </p>
            <Link
              href="/apply/organizer"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 transition-colors"
            >
              Start Organizing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
