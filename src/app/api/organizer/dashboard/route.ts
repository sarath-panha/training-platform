import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Organizer from "@/models/Organizer";
import Event from "@/models/Event";
// Import EventRegistration if/when created

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const organizer = await Organizer.findOne({ email: session.user.email });
    if (!organizer)
      return NextResponse.json(
        { error: "Organizer profile not found" },
        { status: 404 },
      );

    const events = await Event.find({ organizer: organizer._id });

    // Stats Calculation
    const totalEvents = events.length;
    const totalAttendees = events.reduce(
      (acc, curr) => acc + (curr.registeredCount || 0),
      0,
    );
    const activeEvents = events.filter(
      (e) => e.status === "Published" && new Date(e.startDate) > new Date(),
    ).length;

    // Recent Events
    const recentEvents = await Event.find({ organizer: organizer._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      stats: {
        totalEvents,
        totalAttendees,
        activeEvents,
        revenue: 0, // Placeholder until registration system is built
      },
      recentEvents,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
