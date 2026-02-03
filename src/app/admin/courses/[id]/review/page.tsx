import React from "react";
import { PublicCurriculum } from "@/components/public/PublicCurriculum";
import { AdminReviewPanel } from "@/components/courses/AdminReviewPanel";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

// Helper to serialize
const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

async function getCourse(id: string) {
  await connectDB();
  const i = Instructor;
  const c = Category; // Register models

  const course = await Course.findById(id)
    .populate("instructors", "name image bio")
    .populate("category", "name")
    .lean();

  if (!course) return null;
  return serialize(course);
}

export default async function AdminReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Admin Controls Header */}
      <AdminReviewPanel course={course} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Reusing the Public Layout Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Metadata Summary */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Course Details
              </h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <span className="block text-slate-500 text-xs uppercase font-bold">
                    Category
                  </span>
                  <span className="text-slate-900">
                    {course.category?.name || "Uncategorized"}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase font-bold">
                    Price
                  </span>
                  <span className="text-slate-900">${course.price}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-500 text-xs uppercase font-bold">
                    Short Description
                  </span>
                  <span className="text-slate-700">
                    {course.shortDescription}
                  </span>
                </div>
              </div>
            </div>

            {/* Curriculum (Unlocked for Admin) */}
            <PublicCurriculum chapters={course.chapters} isAdmin={true} />

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Description
              </h3>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p className="whitespace-pre-wrap">{course.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar (Instructor Info) */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Instructor(s)
              </h3>
              <div className="space-y-6">
                {course.instructors?.map((inst: any) => (
                  <div key={inst._id} className="flex gap-4">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-12 h-12 rounded-full object-cover bg-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {inst.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-1">Instructor</p>
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {inst.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
