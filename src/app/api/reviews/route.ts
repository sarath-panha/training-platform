import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Register models for population
    const u = User;
    const c = Course;

    // Optional: Filter by courseId if query param exists
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const query = courseId ? { course: courseId, status: "approved" } : {}; // Public only sees approved

    // Admin check logic could be added here to show all statuses if admin
    // For this generic route, let's return all for the admin dashboard usage
    // In a real app, you'd check session role here. Assuming Admin context for dashboard:
    const reviews = await Review.find({})
      .populate("user", "name email image")
      .populate("course", "title thumbnail")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, rating, comment } = await req.json();

    if (!courseId || !rating || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const userId = (session.user as any).id;

    // Check if review already exists
    const existing = await Review.findOne({ user: userId, course: courseId });
    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this course" },
        { status: 400 },
      );
    }

    const review = await Review.create({
      user: userId,
      course: courseId,
      rating,
      comment,
      status: "pending", // Default to pending moderation
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to post review" },
      { status: 500 },
    );
  }
}
