import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { InstructorsTable } from "@/components/instructors/InstructorsTable";
import connectDB from "@/lib/db";
import Instructor from "@/models/Instructor";

async function getInstructors() {
  await connectDB();
  const instructors = await Instructor.find({}).sort({ createdAt: -1 }).lean();
  return instructors.map((i: any) => ({ ...i, _id: i._id.toString() }));
}

export default async function InstructorsPage() {
  const instructors = await getInstructors();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">Instructors</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage teaching staff and profiles.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/instructors/new"
            className="h-[42px] px-4 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> <span>Add Instructor</span>
          </Link>
        </div>
      </div>
      <InstructorsTable instructors={instructors} />
    </div>
  );
}
