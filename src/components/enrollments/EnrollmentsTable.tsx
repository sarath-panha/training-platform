"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  User,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
} from "lucide-react";

interface Enrollment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  course: {
    _id: string;
    title: string;
    thumbnail?: string;
  };
  progress: number;
  enrolledAt: string;
  status: "pending" | "active" | "rejected";
  transactionId?: string;
}

export const EnrollmentsTable = ({
  enrollments,
}: {
  enrollments: Enrollment[];
}) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (res.ok) router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke access?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/enrollments/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
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
                Student
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Course
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Payment
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
            {enrollments.length > 0 ? (
              enrollments.map((enr) => (
                <tr
                  key={enr._id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  {/* User */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {enr.user?.image ? (
                        <img
                          src={enr.user.image}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">
                          {enr.user?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {enr.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden shrink-0 border border-slate-200">
                        {enr.course?.thumbnail && (
                          <img
                            src={enr.course.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-slate-700 line-clamp-2 max-w-[200px]">
                        {enr.course?.title}
                      </span>
                    </div>
                  </td>

                  {/* Payment/Transaction */}
                  <td className="py-4 px-6">
                    {enr.transactionId ? (
                      <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-xs">
                          {enr.transactionId}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Free/No ID
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {new Date(enr.enrolledAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {enr.status === "active" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                    {enr.status === "pending" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {enr.status === "pending" && (
                        <button
                          onClick={() => handleApprove(enr._id)}
                          disabled={!!loadingId}
                          className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
                          title="Approve Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRevoke(enr._id)}
                        disabled={!!loadingId}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors"
                        title="Revoke Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500">
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
