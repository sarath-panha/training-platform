"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  MoreHorizontal,
  User,
  Copy,
  ExternalLink,
} from "lucide-react";

interface BillingRecord {
  _id: string;
  transactionId: string;
  amount: number;
  status: "pending" | "active" | "rejected";
  enrolledAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

export const BillingTable = ({ records }: { records: BillingRecord[] }) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    newStatus: "active" | "rejected",
  ) => {
    if (!confirm(`Mark this transaction as ${newStatus}?`)) return;
    setLoadingId(id);
    try {
      // Re-using the enrollments API since it handles status updates
      await fetch(`/api/enrollments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Transaction ID
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Student
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Course
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Amount
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Date
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
            {records.length > 0 ? (
              records.map((record) => (
                <tr
                  key={record._id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  {/* Transaction ID */}
                  <td className="py-4 px-6 font-mono text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      {record.transactionId}
                      <button
                        onClick={() => copyToClipboard(record.transactionId)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>

                  {/* User */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {record.user?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {record.user?.email}
                      </span>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-4 px-6">
                    <span
                      className="text-slate-700 block max-w-[200px] truncate"
                      title={record.course?.title}
                    >
                      {record.course?.title || "Unknown Course"}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-6 font-medium text-slate-900">
                    {/* Ensure amount is treated as a number before formatting */}
                    ${(Number(record.amount) || 0).toFixed(2)}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    {new Date(record.enrolledAt).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${
                      record.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : record.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {record.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(record._id, "active")
                            }
                            disabled={!!loadingId}
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors"
                            title="Verify Payment"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(record._id, "rejected")
                            }
                            disabled={!!loadingId}
                            className="p-1.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors"
                            title="Reject Payment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {record.status !== "pending" && (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
