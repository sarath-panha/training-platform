import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";
import Category from "@/models/Category"; // Import Category

export async function GET() {
  try {
    await connectDB();
    if (!mongoose.models.Instructor)
      mongoose.model("Instructor", Instructor.schema);
    if (!mongoose.models.Category) mongoose.model("Category", Category.schema); // Register Category

    const courses = await Course.find({})
      .populate("instructors", "name image email")
      .populate("category", "name slug") // Populate Category
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
    await connectDB();
    const body = await req.json();
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
