import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import RoleRequest from "@/models/RoleRequest";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = (session.user as any).id;

    await connectDB();

    // Check for existing pending request
    const existing = await RoleRequest.findOne({
      user: userId,
      status: "pending",
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending application." },
        { status: 400 },
      );
    }

    // Create Request
    const request = await RoleRequest.create({
      user: userId,
      ...body,
      status: "pending",
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("Application Error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
