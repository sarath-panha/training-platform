import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import Organizer from "@/models/Organizer";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Basic role check (middleware handles the redirection, but good for double safety)
    if ((session?.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const organizers = await Organizer.find({}).sort({ createdAt: -1 });
    return NextResponse.json(organizers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizers" },
      { status: 500 },
    );
  }
}
