import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { PublicCourseHero } from "@/components/public/PublicCourseHero";
import { PublicCurriculum } from "@/components/public/PublicCurriculum";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

// Helper to serialize mongo objects
const serialize = (obj: any) => {
  if (!obj) return null;
  return JSON.parse(JSON.stringify(obj));
};

async function getCourseData(id: string) {
  await connectDB();

  // Register models for populate
  const i = Instructor;
  const c = Category;

  const course = await Course.findById(id)
    .populate("instructors", "name image bio")
    .populate("category", "name")
    .lean();

  if (!course) return null;

  return serialize(course);
}

// Updated to return status string or null
async function getEnrollmentStatus(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  await connectDB();
  const userId = (session.user as any).id;

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  return enrollment ? enrollment.status : null; // 'active', 'pending', 'rejected'
}

export default async function PublicCourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const course = await getCourseData(resolvedParams.id);
  const enrollmentStatus = await getEnrollmentStatus(resolvedParams.id);

  if (!course)
    return (
      <div className="min-h-screen bg-white">
        <PublicNavbar />
        <div className="p-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Course not found
          </h1>
          <p className="text-slate-500 mt-2">
            The requested course could not be found.
          </p>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main>
        {/* Hero Section with Actions */}
        <PublicCourseHero course={course} enrollmentStatus={enrollmentStatus} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Learning Outcomes */}
              {course.learningOutcomes &&
                course.learningOutcomes.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                      What you'll learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningOutcomes.map(
                        (outcome: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                            <span className="text-slate-700 text-sm leading-relaxed">
                              {outcome}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Curriculum with Video Locks */}
              <PublicCurriculum
                chapters={course.chapters}
                enrollmentStatus={enrollmentStatus}
              />

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  Description
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
                  <p className="whitespace-pre-wrap">{course.description}</p>
                </div>
              </div>

              {/* Instructors */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Instructors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.instructors?.map((inst: any) => (
                    <div
                      key={inst._id}
                      className="flex gap-4 p-4 border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors"
                    >
                      {inst.image ? (
                        <img
                          src={inst.image}
                          alt={inst.name}
                          className="w-16 h-16 rounded-full object-cover bg-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                          {inst.name.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {inst.name}
                        </h4>
                        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                          Instructor
                        </p>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {inst.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Placeholder (Desktop) */}
            <div className="hidden lg:block lg:col-span-1 space-y-6">
              {/* Reserved for future widgets */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
