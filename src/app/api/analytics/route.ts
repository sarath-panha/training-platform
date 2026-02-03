import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import User from "@/models/User";
import Category from "@/models/Category"; // Added to ensure schema registration

export async function GET() {
  try {
    await connectDB();

    // Ensure Category model is registered for population
    const categoryModel = Category;

    // 1. Total Revenue & Enrollment Count
    const revenueStats = await Enrollment.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          effectiveAmount: {
            $cond: {
              if: { $gt: ["$amount", 0] },
              then: "$amount",
              else: { $ifNull: ["$courseData.price", 0] },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$effectiveAmount" },
          totalEnrollments: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const totalEnrollments = revenueStats[0]?.totalEnrollments || 0;

    // 2. Monthly Revenue Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Enrollment.aggregate([
      {
        $match: {
          status: "active",
          enrolledAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseData",
        },
      },
      { $unwind: { path: "$courseData", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          effectiveAmount: {
            $cond: {
              if: { $gt: ["$amount", 0] },
              then: "$amount",
              else: { $ifNull: ["$courseData.price", 0] },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$enrolledAt" },
            year: { $year: "$enrolledAt" },
          },
          revenue: { $sum: "$effectiveAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = monthlyRevenue.map((item) => ({
      label: months[item._id.month - 1],
      value: item.revenue,
    }));

    // 3. Top Performing Courses
    const topCourses = await Course.find({})
      .select("title thumbnail enrollments category price")
      .populate("category", "name")
      .sort({ enrollments: -1 })
      .limit(5)
      .lean();

    // 4. User Stats
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });

    // 5. Recent Enrollments (For Dashboard Feed)
    const recentEnrollmentsRaw = await Enrollment.find({
      status: { $in: ["active", "pending"] },
    })
      .populate("user", "name image email")
      .populate("course", "title price")
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean();

    // Fix: Ensure amount is displayed correctly by falling back to course price if needed
    const recentEnrollments = recentEnrollmentsRaw.map((enrollment: any) => ({
      ...enrollment,
      amount:
        enrollment.amount && enrollment.amount > 0
          ? enrollment.amount
          : enrollment.course?.price || 0,
    }));

    return NextResponse.json({
      summary: {
        revenue: totalRevenue,
        enrollments: totalEnrollments,
        users: totalUsers,
        instructors: totalInstructors,
      },
      chartData,
      topCourses,
      recentEnrollments,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
