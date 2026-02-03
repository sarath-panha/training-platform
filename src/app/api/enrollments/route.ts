import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const userModel = User;
    const courseModel = Course;

    const enrollments = await Enrollment.find({})
      .populate("user", "name email image")
      .populate("course", "title thumbnail category")
      .sort({ enrolledAt: -1 });

    return NextResponse.json(enrollments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
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

    const { courseId, transactionId } = await req.json();
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID required" },
        { status: 400 },
      );
    }

    await connectDB();
    const userId = (session.user as any).id;

    // Check existing
    const existing = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });
    if (existing) {
      return NextResponse.json({ message: "Already enrolled" });
    }

    // Fetch Course to get current Price
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Create Enrollment with Price Snapshot
    await Enrollment.create({
      user: userId,
      course: courseId,
      transactionId,
      amount: course.price || 0, // Save price snapshot
      status: transactionId ? "pending" : "active", // Auto-activate free courses
    });

    // Auto-increment if free
    if (!transactionId || course.price === 0) {
      await Course.findByIdAndUpdate(courseId, { $inc: { enrollments: 1 } });
    }

    return NextResponse.json(
      { message: "Enrollment successful" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}
