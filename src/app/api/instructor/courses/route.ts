import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const catModel = Category; // Register model

    // Find Instructor ID
    const instructor = await Instructor.findOne({ email: session.user.email });
    if (!instructor) return NextResponse.json([], { status: 200 }); // Return empty if profile missing

    const courses = await Course.find({ instructors: instructor._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}
