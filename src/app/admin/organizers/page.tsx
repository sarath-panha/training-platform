import React from "react";
import Link from "next/link";
import { OrganizersTable } from "@/components/admin/OrganizersTable";
import { OrganizerRequestsTable } from "@/components/admin/OrganizerRequestsTable";
import connectDB from "@/lib/db";
import Organizer from "@/models/Organizer";
import RoleRequest from "@/models/RoleRequest";
import User from "@/models/User";

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();
  const userModel = User;

  const [organizers, requests] = await Promise.all([
    Organizer.find({}).sort({ createdAt: -1 }).lean(),
    RoleRequest.find({ requestedRole: "organizer", status: "pending" })
      .populate("user", "name email image")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    organizers: organizers.map((i: any) => ({ ...i, _id: i._id.toString() })),
    requests: requests.map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt.toISOString(),
      user: r.user ? { ...r.user, _id: r.user._id.toString() } : null,
    })),
  };
}

export default async function OrganizersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { organizers, requests } = await getData();
  const { tab } = await searchParams;
  const activeTab = tab || "active";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-slate-900">
          Organizer Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Oversee event organizers and review new applications.
        </p>
      </div>

      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <Link
            href="/admin/organizers?tab=active"
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === "active" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Active Organizers ({organizers.length})
          </Link>
          <Link
            href="/admin/organizers?tab=requests"
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === "requests" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Pending Requests ({requests.length})
          </Link>
        </nav>
      </div>

      {activeTab === "active" ? (
        <OrganizersTable organizers={organizers} />
      ) : (
        <OrganizerRequestsTable requests={requests} />
      )}
    </div>
  );
}
