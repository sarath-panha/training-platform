import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RoleRequest from "@/models/RoleRequest";
import User from "@/models/User";
import Instructor from "@/models/Instructor";

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const params = await props.params;
    const { status } = await req.json(); // 'approved' or 'rejected'

    const request = await RoleRequest.findById(params.id);
    if (!request)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Update Request Status
    request.status = status;
    await request.save();

    if (status === "approved") {
      // 1. Update User Role
      const user = await User.findByIdAndUpdate(
        request.user,
        { role: "instructor" },
        { new: true },
      );

      // 2. Create/Update Instructor Profile if it doesn't exist
      const existingProfile = await Instructor.findOne({ email: user.email });
      if (!existingProfile) {
        await Instructor.create({
          name: user.name,
          email: user.email,
          image: user.image,
          bio: request.bio,
          expertise: request.expertise || [],
        });
      }
    }

    return NextResponse.json({ message: "Request updated successfully" });
  } catch (error) {
    console.error("Approval Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
