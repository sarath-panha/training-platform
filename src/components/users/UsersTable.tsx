"use client";

import React, { useState } from "react";
import {
  Mail,
  Trash2,
  Shield,
  User,
  Briefcase,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  category?: { name: string };
  provider: string;
  image?: string;
  createdAt: string;
}

export const UsersTable = ({ users }: { users: UserData[] }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsDeleting(id);
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case "instructor":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-3 h-3" /> Instructor
          </span>
        );
      case "organizer":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Calendar className="w-3 h-3" /> Organizer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
            <User className="w-3 h-3" /> Participant
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                User
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Role
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Profession
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Auth
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Joined
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {user.name}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                  <td className="py-4 px-6">
                    {user.category ? (
                      <span className="flex items-center gap-1 text-slate-700">
                        <Briefcase className="w-3 h-3 text-slate-400" />{" "}
                        {user.category.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs text-slate-500 uppercase font-medium">
                      {user.provider}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={isDeleting === user._id}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
