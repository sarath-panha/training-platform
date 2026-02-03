"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

interface PublicEventCardProps {
  event: any;
}

export const PublicEventCard = ({ event }: PublicEventCardProps) => {
  return (
    <Link href="#" className="group block h-full">
      <div className="h-full border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-lg transition-all duration-300 flex flex-col rounded-lg overflow-hidden relative">
        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded text-center shadow-sm z-10">
          <span className="block text-xs font-bold text-slate-500 uppercase">
            {new Date(event.startDate).toLocaleString("default", {
              month: "short",
            })}
          </span>
          <span className="block text-lg font-bold text-indigo-600 leading-none">
            {new Date(event.startDate).getDate()}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <span className="text-xs font-bold uppercase tracking-widest">
                Event
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 pt-12">
            <span className="text-white text-xs font-medium bg-indigo-600 px-2 py-0.5 rounded-full">
              {event.category?.name || "General"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="w-4 h-4 text-slate-400" />
              <span>
                {event.registeredCount} / {event.capacity} Attending
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
            {event.organizer?.image ? (
              <img
                src={event.organizer.image}
                className="w-6 h-6 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-100" />
            )}
            <span className="text-xs font-medium text-slate-500 truncate">
              By {event.organizer?.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
