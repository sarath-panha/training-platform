"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Users, TrendingUp, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrganizerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/organizer/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  if (loading)
    return (
      <div className="flex h-[50vh] justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  if (!data) return <div className="p-8 text-center">Failed to load data.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-slate-900">
            Organizer Dashboard
          </h2>
          <p className="text-slate-500 mt-1">
            Manage your events and track registrations.
          </p>
        </div>
        <Link
          href="/organizer/events/new"
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Events
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.stats.totalEvents}
            </h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Attendees
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.stats.totalAttendees}
            </h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Events
            </p>
            <h3 className="text-2xl font-bold text-slate-900">
              {data.stats.activeEvents}
            </h3>
          </div>
        </Card>
      </div>
    </div>
  );
}
