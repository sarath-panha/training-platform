import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Instructor from "@/models/Instructor";

export async function GET() {
  try {
    await connectDB();
    const instructors = await Instructor.find({}).sort({ createdAt: -1 });
    return NextResponse.json(instructors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch instructors" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const instructor = await Instructor.create(body);
    return NextResponse.json(instructor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create instructor" },
      { status: 500 },
    );
  }
}
