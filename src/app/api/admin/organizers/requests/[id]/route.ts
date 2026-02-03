import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RoleRequest from "@/models/RoleRequest";
import User from "@/models/User";
import Organizer from "@/models/Organizer";

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
        { role: "organizer" },
        { new: true },
      );

      // 2. Create/Update Organizer Profile
      const existingProfile = await Organizer.findOne({ email: user.email });
      if (!existingProfile) {
        await Organizer.create({
          user: user._id,
          name: request.organizationName || user.name, // Use org name if provided
          email: user.email,
          image: user.image,
          phone: request.phone,
          website: request.website,
          bio: request.pastEventsDescription, // Use past experience as initial bio
          eventTypes: request.eventTypes || [],
        });
      }
    }

    return NextResponse.json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("Organizer Approval Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
