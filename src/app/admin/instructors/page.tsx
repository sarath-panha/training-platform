import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { InstructorsTable } from "@/components/instructors/InstructorsTable";
import { InstructorRequestsTable } from "@/components/instructors/InstructorRequestsTable";
import connectDB from "@/lib/db";
import Instructor from "@/models/Instructor";
import RoleRequest from "@/models/RoleRequest";
import User from "@/models/User";

// Force dynamic since we are fetching requests that change frequently
export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();

  // Ensure User model is registered for populate
  const userModel = User;

  const [instructors, requests] = await Promise.all([
    Instructor.find({}).sort({ createdAt: -1 }).lean(),
    RoleRequest.find({ requestedRole: "instructor", status: "pending" })
      .populate("user", "name email image")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    instructors: instructors.map((i: any) => ({ ...i, _id: i._id.toString() })),
    requests: requests.map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt.toISOString(),
      user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
    })),
  };
}

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { instructors, requests } = await getData();
  const { tab } = await searchParams;
  const activeTab = tab || "active"; // 'active' or 'requests'

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">Instructors</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage teaching staff and review applications.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/instructors/new"
            className="h-[42px] px-4 bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> <span>Add Instructor</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <Link
            href="/admin/instructors?tab=active"
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "active"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }
            `}
          >
            Active Instructors ({instructors.length})
          </Link>
          <Link
            href="/admin/instructors?tab=requests"
            className={`
              whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "requests"
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }
            `}
          >
            Pending Requests ({requests.length})
          </Link>
        </nav>
      </div>

      {activeTab === "active" ? (
        <InstructorsTable instructors={instructors} />
      ) : (
        <InstructorRequestsTable requests={requests} />
      )}
    </div>
  );
}
