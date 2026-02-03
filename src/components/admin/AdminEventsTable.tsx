"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Calendar, MapPin, Users, Building2 } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  thumbnail: string;
  organizer: { name: string };
  location: string;
  startDate: string;
  registeredCount: number;
  capacity: number;
  status: string;
}

export const AdminEventsTable = ({ events }: { events: Event[] }) => {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await fetch(`/api/organizer/events/${id}`, {
        method: "DELETE",
      }); // Reusing existing delete logic
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Event
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Organizer
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Logistics
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
                Registrations
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Status
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event._id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        {event.thumbnail && (
                          <img
                            src={event.thumbnail}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-bold text-slate-900 line-clamp-1 max-w-[180px]">
                        {event.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {event.organizer?.name || "Unknown"}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />{" "}
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {event.registeredCount} / {event.capacity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        event.status === "Published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
