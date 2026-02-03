import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Organizer from "@/models/Organizer";
import Event from "@/models/Event";
import Category from "@/models/Category";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const c = Category; // Register model

    const organizer = await Organizer.findOne({ email: session.user.email });
    if (!organizer) return NextResponse.json([], { status: 200 });

    const events = await Event.find({ organizer: organizer._id })
      .populate("category", "name")
      .sort({ startDate: 1 });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const organizer = await Organizer.findOne({ email: session.user.email });
    if (!organizer)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const body = await req.json();
    const event = await Event.create({
      ...body,
      organizer: organizer._id,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
