"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

interface Props {
  course: any;
}

export const AdminReviewPanel = ({ course }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (
    newStatus: "Published" | "Draft" | "Review",
  ) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`))
      return;

    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.push("/admin/courses");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-light">Admin Review Mode</h1>
            </div>
            <p className="text-slate-400 max-w-2xl">
              You are viewing{" "}
              <strong className="text-white">{course.title}</strong> as a
              student would, but with full access to all content. Verify the
              quality, check video playback, and set the publication status
              below.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col gap-3 w-full md:w-auto min-w-[300px]">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-slate-400">Current Status:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-xs uppercase tracking-wide
                    ${
                      course.status === "Published"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : course.status === "Review"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-500/20 text-slate-400"
                    }`}
              >
                {course.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange("Draft")}
                disabled={loading}
                className="flex-1 py-2 bg-rose-900/50 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => handleStatusChange("Published")}
                disabled={loading}
                className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle className="w-4 h-4" /> Approve & Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
