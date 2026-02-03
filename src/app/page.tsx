import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PublicCourseCard } from "@/components/home/PublicCourseCard";
import { PublicEventCard } from "@/components/home/PublicEventCard";
import { RoleCallToAction } from "@/components/home/RoleCallToAction";
import { Footer } from "@/components/layout/Footer";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Event from "@/models/Event";
import Instructor from "@/models/Instructor";
import Organizer from "@/models/Organizer";
import Category from "@/models/Category";

// --- Data Fetching ---
async function getHomeData() {
  await connectDB();

  // Register models to avoid missing schema errors
  const models = [Instructor, Organizer, Category, Course, Event];

  const [courses, events, topInstructors] = await Promise.all([
    // 1. Popular Courses
    Course.find({ status: "Published" })
      .populate("instructors", "name")
      .populate("category", "name")
      .sort({ enrollments: -1 })
      .limit(4)
      .lean(),

    // 2. Upcoming Events
    // FIX: Removed date filter to ensure events show up during demo/testing
    Event.find({ status: "Published" })
      .populate("organizer", "name image")
      .populate("category", "name")
      .sort({ startDate: 1 })
      .limit(3)
      .lean(),

    // 3. Featured Instructors
    Instructor.find({}).sort({ rating: -1, students: -1 }).limit(4).lean(),
  ]);

  return {
    courses: courses.map((c: any) => ({
      ...c,
      _id: c._id.toString(),
      createdAt: c.createdAt?.toISOString(),
      updatedAt: c.updatedAt?.toISOString(),
      // Robust instructor mapping to handle potential bad refs
      instructors: Array.isArray(c.instructors)
        ? c.instructors.map((i: any) => ({
            ...i,
            _id: i._id ? i._id.toString() : "unknown",
          }))
        : [],
      // Handle legacy string category or populated object
      category:
        c.category && typeof c.category === "object"
          ? c.category.name
          : c.category || "General",
      chapters: [],
    })),
    events: events.map((e: any) => ({
      ...e,
      _id: e._id.toString(),
      startDate: e.startDate
        ? e.startDate.toISOString()
        : new Date().toISOString(),
      endDate: e.endDate?.toISOString(),
      organizer: e.organizer
        ? { ...e.organizer, _id: e.organizer._id.toString() }
        : null,
      category: e.category ? { name: e.category.name } : null,
    })),
    instructors: topInstructors.map((i: any) => ({
      ...i,
      _id: i._id.toString(),
    })),
  };
}

export default async function HomePage() {
  const { courses, events, instructors } = await getHomeData();

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main>
        <Hero />
        <FeaturedCategories />

        {/* Popular Courses Section */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-light text-slate-900">
                  Popular Courses
                </h2>
                <p className="text-slate-500 mt-2">
                  Top-rated content selected by the community.
                </p>
              </div>
              <Link
                href="/courses"
                className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                View All Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <PublicCourseCard key={course._id} course={course} />
                ))
              ) : (
                <div className="col-span-4 py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No courses available yet. Check back soon!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-light text-slate-900">
                  Upcoming Events
                </h2>
                <p className="text-slate-500 mt-2">
                  Workshops, seminars, and conferences near you.
                </p>
              </div>
              <button className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-wider flex items-center gap-2">
                View Calendar <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.length > 0 ? (
                events.map((event) => (
                  <PublicEventCard key={event._id} event={event} />
                ))
              ) : (
                <div className="col-span-3 py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  No upcoming events scheduled.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Instructors */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light text-slate-900 mb-10 text-center">
              Meet Our Top Instructors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.map((inst) => (
                <div
                  key={inst._id}
                  className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full mb-4 overflow-hidden">
                    {inst.image ? (
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                        {inst.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                    {inst.expertise?.[0] || "Dental Professional"}
                  </p>
                  <div className="flex justify-center items-center gap-1 text-amber-500 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" /> {inst.rating}
                    <span className="text-slate-400 font-normal ml-1">
                      ({inst.students} students)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Role Application CTA */}
        <RoleCallToAction />
      </main>

      <Footer />
    </div>
  );
}
