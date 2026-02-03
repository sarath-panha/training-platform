import React from "react";
import { AdminEventsTable } from "@/components/admin/AdminEventsTable";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import Organizer from "@/models/Organizer";

export const dynamic = "force-dynamic";

async function getEvents() {
  await connectDB();
  const o = Organizer; // Register model

  const events = await Event.find({})
    .populate("organizer", "name")
    .sort({ startDate: -1 })
    .lean();

  return events.map((e: any) => ({
    ...e,
    _id: e._id.toString(),
    startDate: e.startDate.toISOString(),
    organizer: e.organizer
      ? { ...e.organizer, _id: e.organizer._id.toString() }
      : null,
  }));
}

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            Event Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor all platform events.
          </p>
        </div>
        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold">
          Total Events: {events.length}
        </div>
      </div>
      <AdminEventsTable events={events} />
    </div>
  );
}
