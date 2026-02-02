import React from "react";
import { EnrollmentsTable } from "@/components/enrollments/EnrollmentsTable";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";

async function getEnrollments() {
  await connectDB();

  const userModel = User;
  const courseModel = Course;

  const enrollments = await Enrollment.find({})
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

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments();
  const pendingCount = enrollments.filter(
    (e: any) => e.status === "pending",
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">Enrollments</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage payments and access.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold border border-amber-100">
            Pending Approval: {pendingCount}
          </div>
          <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold border border-slate-200">
            Total: {enrollments.length}
          </div>
        </div>
      </div>
      <EnrollmentsTable enrollments={enrollments} />
    </div>
  );
}
