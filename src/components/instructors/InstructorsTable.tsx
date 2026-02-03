import React from "react";
import Link from "next/link";
import { Edit, Trash2, Mail, Users, BookOpen } from "lucide-react";

interface Instructor {
  _id: string;
  name: string;
  email: string;
  image: string;
  expertise: string[];
  students: number;
  coursesCount: number;
}

export const InstructorsTable = ({
  instructors,
}: {
  instructors: Instructor[];
}) => (
  <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Instructor
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Contact
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
              Expertise
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
              Stats
            </th>
            <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {instructors.length > 0 ? (
            instructors.map((inst) => (
              <tr
                key={inst._id}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {inst.image ? (
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {inst.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-slate-900">
                      {inst.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5" /> {inst.email}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {inst.expertise.slice(0, 2).map((exp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full border border-slate-200"
                      >
                        {exp}
                      </span>
                    ))}
                    {inst.expertise.length > 2 && (
                      <span className="text-xs text-slate-400">
                        +{inst.expertise.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {inst.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {inst.coursesCount}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/admin/instructors/${inst._id}/edit`}
                      className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500">
                No instructors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
