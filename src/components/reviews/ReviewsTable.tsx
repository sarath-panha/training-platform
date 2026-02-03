"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  User,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
} from "lucide-react";

interface Review {
  _id: string;
  user: { name: string; image?: string };
  course: { title: string; thumbnail?: string };
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const ReviewsTable = ({ reviews }: { reviews: Review[] }) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    setLoadingId(id);
    try {
      await fetch(`/api/reviews/${id}`, {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    setLoadingId(id);
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
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
              <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs w-64">
                User & Course
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs w-32">
                Rating
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs">
                Comment
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs w-32">
                Status
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs text-center w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 mb-2">
                      {review.user?.image ? (
                        <img
                          src={review.user.image}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-500" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900">
                        {review.user?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 pl-9">
                      on{" "}
                      <span className="font-medium text-slate-700">
                        {review.course?.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="relative group cursor-help">
                      <p className="text-slate-600 line-clamp-2">
                        {review.comment}
                      </p>
                      {/* Tooltip for full text */}
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded z-10 shadow-lg">
                        {review.comment}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                    ${
                      review.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : review.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {review.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(review._id, "approved")
                            }
                            disabled={!!loadingId}
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(review._id, "rejected")
                            }
                            disabled={!!loadingId}
                            className="p-1.5 bg-rose-100 text-rose-600 rounded hover:bg-rose-200"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={!!loadingId}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete"
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
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
