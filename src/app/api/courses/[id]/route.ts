import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Instructor from "@/models/Instructor";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const course = await Course.findById(params.id).populate(
      "instructors",
      "name image",
    );
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || !["admin", "instructor"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params;
    const body = await req.json();

    // Admin Restriction: Can only approve/review (update status)
    if (userRole === "admin") {
      // If admin tries to update anything other than status, ignore other fields or error
      // Here we filter to only allow status updates
      const adminUpdate = { status: body.status };
      const course = await Course.findByIdAndUpdate(params.id, adminUpdate, {
        new: true,
      });
      return NextResponse.json(course);
    }

    // Instructor: Can update content, invite others (update instructors array)
    if (userRole === "instructor") {
      // Ideally check if this instructor owns the course
      // For now allowing any instructor to edit if they have access
      const course = await Course.findByIdAndUpdate(params.id, body, {
        new: true,
      });
      return NextResponse.json(course);
    }
  } catch (error) {
    console.error("Update Course Error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (!session || !["admin", "instructor"].includes(userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const params = await props.params;
    const course = await Course.findById(params.id);

    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Restriction: Instructor cannot delete if course is Published
    if (userRole === "instructor" && course.status === "Published") {
      return NextResponse.json(
        { error: "Cannot delete a published course. Contact admin." },
        { status: 403 },
      );
    }

    await Course.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
