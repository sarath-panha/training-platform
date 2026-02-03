"use client";

import React from "react";
import Link from "next/link";
import { Edit, Trash2, Globe, Phone, Building2 } from "lucide-react";

interface Organizer {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  website: string;
  eventsCount: number;
}

export const OrganizersTable = ({
  organizers,
}: {
  organizers: Organizer[];
}) => (
  <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Organization
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Contact
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
              Events
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {organizers.length > 0 ? (
            organizers.map((org) => (
              <tr
                key={org._id}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {org.image ? (
                      <img
                        src={org.image}
                        alt={org.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {org.name}
                      </span>
                      <a
                        href={org.website}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" /> Website
                      </a>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1 text-slate-600 text-xs">
                    <span className="font-medium">{org.email}</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {org.phone}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center font-bold text-slate-900">
                  {org.eventsCount}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-8 text-center text-slate-500">
                No organizers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
