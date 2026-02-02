import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Instructor from "@/models/Instructor";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const instructor = await Instructor.findById(params.id);
    if (!instructor)
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 },
      );
    return NextResponse.json(instructor);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch instructor" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const body = await req.json();
    const instructor = await Instructor.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!instructor)
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 },
      );
    return NextResponse.json(instructor);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update instructor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const instructor = await Instructor.findByIdAndDelete(params.id);
    if (!instructor)
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 },
      );
    return NextResponse.json({ message: "Instructor deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete instructor" },
      { status: 500 },
    );
  }
}
