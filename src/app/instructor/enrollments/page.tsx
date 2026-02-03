import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { EnrollmentsTable } from "@/components/enrollments/EnrollmentsTable";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import User from "@/models/User";

async function getInstructorEnrollments() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  await connectDB();

  // Register models
  const u = User;
  const c = Course;
  const i = Instructor;

  // 1. Get Instructor ID
  const instructor = await Instructor.findOne({ email: session.user.email });
  if (!instructor) return [];

  // 2. Get Courses taught by this instructor
  const courses = await Course.find({ instructors: instructor._id }).select(
    "_id",
  );
  const courseIds = courses.map((c) => c._id);

  // 3. Find Enrollments for these courses
  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate("user", "name email image")
    .populate("course", "title thumbnail")
    .sort({ enrolledAt: -1 })
    .lean();

  return enrollments.map((enr: any) => ({
    ...enr,
    _id: enr._id.toString(),
    enrolledAt: enr.enrolledAt.toISOString(),
    updatedAt: enr.updatedAt?.toISOString(),
    user: enr.user ? { ...enr.user, _id: enr.user._id.toString() } : null,
    course: enr.course
      ? { ...enr.course, _id: enr.course._id.toString() }
      : null,
  }));
}

export default async function InstructorEnrollmentsPage() {
  const enrollments = await getInstructorEnrollments();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">My Students</h2>
          <p className="text-slate-500 text-sm mt-1">
            Track enrollments for your courses.
          </p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold border border-indigo-100">
          Total Enrollments: {enrollments.length}
        </div>
      </div>

      {/* Reusing the shared EnrollmentsTable */}
      <EnrollmentsTable enrollments={enrollments} />
    </div>
  );
}
