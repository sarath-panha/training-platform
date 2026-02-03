import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { BillingTable } from "@/components/billing/BillingTable";
import { BillingStats } from "@/components/billing/BillingStats";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import User from "@/models/User";

async function getInstructorBilling() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  await connectDB();
  const u = User;
  const c = Course;
  const i = Instructor;

  // 1. Get Instructor ID
  const instructor = await Instructor.findOne({ email: session.user.email });
  if (!instructor) return [];

  // 2. Get Courses
  const courses = await Course.find({ instructors: instructor._id }).select(
    "_id",
  );
  const courseIds = courses.map((c) => c._id);

  // 3. Find Payments (Enrollments with transactionId)
  const records = await Enrollment.find({
    course: { $in: courseIds },
    transactionId: { $exists: true, $ne: "FREE_COURSE" },
  })
    .populate("user", "name email")
    .populate("course", "title thumbnail price") // Populate price for fallback
    .sort({ enrolledAt: -1 })
    .lean();

  return records.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    enrolledAt: p.enrolledAt.toISOString(),
    amount: p.amount !== undefined ? p.amount : p.course?.price || 0,
    user: p.user ? { ...p.user, _id: p.user._id.toString() } : null,
    course: p.course ? { ...p.course, _id: p.course._id.toString() } : null,
  }));
}

export default async function InstructorBillingPage() {
  const records = await getInstructorBilling();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900">
          Billing & Revenue
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Financial overview for your courses.
        </p>
      </div>

      <BillingStats records={records} />
      <BillingTable records={records} />
    </div>
  );
}
