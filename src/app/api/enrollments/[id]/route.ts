import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

// Approve Enrollment
export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const { status } = await req.json(); // Expect 'active'

    const enrollment = await Enrollment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true },
    );

    if (!enrollment)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // If approved, increment course count
    if (status === "active" && enrollment.course) {
      await Course.findByIdAndUpdate(enrollment.course, {
        $inc: { enrollments: 1 },
      });
    }

    return NextResponse.json(enrollment);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// Revoke/Delete Enrollment
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;

    const enrollment = await Enrollment.findByIdAndDelete(params.id);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    // Decrement course enrollment count ONLY if it was active
    if (enrollment.status === "active" && enrollment.course) {
      await Course.findByIdAndUpdate(enrollment.course, {
        $inc: { enrollments: -1 },
      });
    }

    return NextResponse.json({ message: "Enrollment revoked successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revoke enrollment" },
      { status: 500 },
    );
  }
}
