import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Organizer from "@/models/Organizer";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const o = Organizer;
    const c = Category; // Register models

    const events = await Event.find({})
      .populate("organizer", "name email")
      .populate("category", "name")
      .sort({ startDate: -1 });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
