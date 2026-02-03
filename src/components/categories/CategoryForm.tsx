"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

interface CategoryFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoryForm = ({
  initialData,
  onSuccess,
  onCancel,
}: CategoryFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "course",
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        type: initialData.type || "course",
      });
    } else {
      setFormData({ name: "", slug: "", description: "", type: "course" });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!initialData?._id;
    const url = isEdit
      ? `/api/categories/${initialData._id}`
      : "/api/categories";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
        router.refresh();
      } else {
        console.error("Failed to save category");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
          Category Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg transition-colors"
        >
          <option value="course">Course</option>
          <option value="event">Event</option>
          <option value="user">Participant (User)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
          Name
        </label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg transition-colors"
          placeholder="e.g. Endodontics"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
          Slug (Optional)
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg transition-colors"
          placeholder="endodontics"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Leave blank to auto-generate from name.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
          Description
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2.5 bg-white border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg transition-colors"
          placeholder="Brief description of this category..."
        />
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Category
            </>
          )}
        </button>
      </div>
    </form>
  );
};
