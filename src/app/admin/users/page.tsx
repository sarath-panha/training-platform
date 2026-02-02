import React from "react";
import { UsersTable } from "@/components/users/UsersTable";
import connectDB from "@/lib/db";
import User from "@/models/User";

async function getUsers() {
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  return users.map((u: any) => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            User Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor and manage platform users.
          </p>
        </div>
        <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold">
          Total Users: {users.length}
        </div>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
