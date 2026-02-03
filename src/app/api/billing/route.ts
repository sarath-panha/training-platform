import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();

    // Register models
    const u = User;
    const c = Course;

    // Fetch only enrollments that have a transaction ID (paid or manual)
    const billingRecords = await Enrollment.find({
      transactionId: { $exists: true, $ne: "FREE_COURSE" },
    })
      .populate("user", "name email image")
      .populate("course", "title thumbnail")
      .sort({ enrolledAt: -1 });

    return NextResponse.json(billingRecords);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch billing records" },
      { status: 500 },
    );
  }
}
