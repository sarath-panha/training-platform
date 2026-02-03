import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { ReviewsTable } from "@/components/reviews/ReviewsTable";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import User from "@/models/User";

async function getInstructorReviews() {
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

  // 3. Find Reviews
  const reviews = await Review.find({ course: { $in: courseIds } })
    .populate("user", "name image")
    .populate("course", "title thumbnail")
    .sort({ createdAt: -1 })
    .lean();

  return reviews.map((r: any) => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt.toISOString(),
    user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
    course: r.course ? { ...r.course, _id: r.course._id.toString() } : null,
  }));
}

export default async function InstructorReviewsPage() {
  const reviews = await getInstructorReviews();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900">Student Reviews</h2>
        <p className="text-slate-500 text-sm mt-1">
          Feedback from students enrolled in your courses.
        </p>
      </div>

      <ReviewStats reviews={reviews} />
      <ReviewsTable reviews={reviews} />
    </div>
  );
}
