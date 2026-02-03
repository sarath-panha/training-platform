import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    // 1. Get email from URL query
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Please provide ?email=your@email.com" },
        { status: 400 },
      );
    }

    await connectDB();

    // 2. Find user and update role to 'admin'
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: "admin" },
      { new: true },
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${user.email} is now an Admin. Please log out and log back in.`,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
