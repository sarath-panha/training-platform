import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Enrollment from "@/models/Enrollment";
import Review from "@/models/Review";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Find Instructor Profile by Email
    const instructor = await Instructor.findOne({ email: session.user.email });
    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor profile not found" },
        { status: 404 },
      );
    }

    // 2. Find My Courses
    const myCourses = await Course.find({ instructors: instructor._id });
    const courseIds = myCourses.map((c) => c._id);

    // 3. Calculate Stats
    const totalStudents = myCourses.reduce(
      (acc, curr) => acc + (curr.enrollments || 0),
      0,
    );

    // Revenue (Estimated share)
    // Find enrollments for my courses that are active
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      status: "active",
    });

    // Simple revenue calc (assuming 100% share for simplicity, can be adjusted)
    const totalRevenue = enrollments.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );

    // 4. Reviews
    const reviews = await Review.find({ course: { $in: courseIds } });
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          ).toFixed(1)
        : "0.0";

    // 5. Recent Activity (New Enrollments)
    const recentActivity = await Enrollment.find({ course: { $in: courseIds } })
      .populate("user", "name image")
      .populate("course", "title")
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      stats: {
        courses: myCourses.length,
        students: totalStudents,
        revenue: totalRevenue,
        rating: avgRating,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Instructor Dashboard Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
