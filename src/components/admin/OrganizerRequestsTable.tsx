"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Globe, Phone, User } from "lucide-react";

interface Request {
  _id: string;
  user: { name: string; email: string; image?: string };
  organizationName?: string;
  website?: string;
  phone?: string;
  eventTypes?: string[];
  pastEventsDescription?: string;
  createdAt: string;
}

export const OrganizerRequestsTable = ({
  requests,
}: {
  requests: Request[];
}) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (!confirm(`Are you sure you want to ${status} this application?`))
      return;
    setLoadingId(id);
    try {
      await fetch(`/api/admin/organizers/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Applicant
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs w-1/3">
                Details
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Planned Events
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Date
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr
                  key={req._id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-center gap-3">
                      {req.user?.image ? (
                        <img
                          src={req.user.image}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">
                          {req.organizationName || req.user?.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {req.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 align-top space-y-2">
                    <div className="flex flex-col gap-1 text-xs">
                      {req.website && (
                        <a
                          href={req.website}
                          target="_blank"
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Globe className="w-3 h-3" /> {req.website}
                        </a>
                      )}
                      {req.phone && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Phone className="w-3 h-3" /> {req.phone}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs italic line-clamp-3 bg-slate-50 p-2 rounded border border-slate-100">
                      "{req.pastEventsDescription}"
                    </p>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <div className="flex flex-wrap gap-1">
                      {req.eventTypes?.map((type, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 align-top text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 align-top text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleAction(req._id, "approved")}
                        disabled={!!loadingId}
                        className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "rejected")}
                        disabled={!!loadingId}
                        className="p-1.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No pending applications.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
