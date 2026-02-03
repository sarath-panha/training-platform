import React from "react";
import { BillingTable } from "@/components/billing/BillingTable";
import { BillingStats } from "@/components/billing/BillingStats";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import Course from "@/models/Course";

async function getBillingRecords() {
  await connectDB();
  const u = User;
  const c = Course; // Ensure models registered

  const records = await Enrollment.find({
    transactionId: { $exists: true, $ne: "FREE_COURSE" },
  })
    .populate("user", "name email")
    .populate("course", "title thumbnail price") // ADDED: price
    .sort({ enrolledAt: -1 })
    .lean();

  return records.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    enrolledAt: p.enrolledAt.toISOString(),
    amount: p.amount !== undefined ? p.amount : p.course?.price || 0, // Fallback to current course price if snapshot missing
    user: p.user ? { ...p.user, _id: p.user._id.toString() } : null,
    course: p.course ? { ...p.course, _id: p.course._id.toString() } : null,
  }));
}

export default async function BillingPage() {
  const records = await getBillingRecords();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-900">
          Billing Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Track course revenue, verify payments, and manage invoices.
        </p>
      </div>

      <BillingStats records={records} />
      <BillingTable records={records} />
    </div>
  );
}
