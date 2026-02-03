"use client";

import React, { useEffect, useState } from "react";
import { EventsTable } from "@/components/events/EventsTable";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organizer/events")
      .then((res) => res.json())
      .then((d) => {
        setEvents(d);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-8">
        <div>
          <h2 className="text-2xl font-light text-slate-900">My Events</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage schedules and details.
          </p>
        </div>
        <Link
          href="/organizer/events/new"
          className="h-[42px] px-4 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm rounded-full"
        >
          <Plus className="w-4 h-4" /> <span>Create Event</span>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <EventsTable events={events} />
      )}
    </div>
  );
}
