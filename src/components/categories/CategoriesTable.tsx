"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Trash2,
  Folder,
  Layers,
  User,
  Calendar,
  FolderOpen,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  courseCount: number;
}

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export const CategoriesTable = ({ categories, onEdit }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setIsDeleting(id);
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "course":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Layers className="w-3 h-3" /> Course
          </span>
        );
      case "user":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            <User className="w-3 h-3" /> Participant
          </span>
        );
      case "event":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <Calendar className="w-3 h-3" /> Event
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
            <Folder className="w-3 h-3" /> {type}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Name
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Slug
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">
                Type
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs w-1/3">
                Description
              </th>
              <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-lg text-slate-500">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="py-4 px-6">{getTypeBadge(cat.type)}</td>
                  <td className="py-4 px-6 text-slate-600 truncate max-w-xs">
                    {cat.description || "-"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(cat)}
                        className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={isDeleting === cat._id}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-colors disabled:opacity-50"
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
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
