import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";

export async function GET() {
  try {
    await connectDB();
    // Ensure models are registered
    const instructorModel = Instructor;

    const courses = await Course.find({})
      .populate("instructors", "name image email")
      .sort({ createdAt: -1 });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // Restriction: Admins cannot create courses, only Instructors can.
    if (userRole !== "instructor") {
      return NextResponse.json(
        { error: "Only instructors can create courses." },
        { status: 403 },
      );
    }

    await connectDB();
    const body = await req.json();

    const creatorProfile = await Instructor.findOne({
      email: session?.user?.email,
    });
    if (
      creatorProfile &&
      body.instructors &&
      !body.instructors.includes(creatorProfile._id.toString())
    ) {
      body.instructors.push(creatorProfile._id);
    }

    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Create Course Error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
