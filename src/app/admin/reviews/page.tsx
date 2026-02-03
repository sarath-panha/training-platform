import React from "react";
import { ReviewsTable } from "@/components/reviews/ReviewsTable";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";
import Course from "@/models/Course";

async function getReviews() {
  await connectDB();
  const u = User;
  const c = Course;

  const reviews = await Review.find({})
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

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900">
          Reviews Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Moderate feedback and track user satisfaction.
        </p>
      </div>

      <ReviewStats reviews={reviews} />
      <ReviewsTable reviews={reviews} />
    </div>
  );
}
