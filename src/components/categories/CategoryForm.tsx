"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const CategoryForm = ({ initialData }: { initialData?: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
  });

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
        router.push("/admin/categories");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            {initialData ? "Edit Category" : "Create Category"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Organize courses into topics.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 flex items-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Category
              </>
            )}
          </button>
        </div>
      </div>

      <Card className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
            Name
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
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
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
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
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
            placeholder="Category description..."
          />
        </div>
      </Card>
    </form>
  );
};
