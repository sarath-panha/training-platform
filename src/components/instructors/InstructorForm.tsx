"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const InstructorForm = ({ initialData }: { initialData?: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    bio: initialData?.bio || "",
    image: initialData?.image || "",
  });
  const [expertise, setExpertise] = useState<string[]>(
    initialData?.expertise || [""],
  );

  const handleExpertiseChange = (idx: number, val: string) => {
    const newExp = [...expertise];
    newExp[idx] = val;
    setExpertise(newExp);
  };

  const addExpertise = () => setExpertise([...expertise, ""]);
  const removeExpertise = (idx: number) =>
    setExpertise(expertise.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = !!initialData?._id;
    const url = isEdit
      ? `/api/instructors/${initialData._id}`
      : "/api/instructors";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertise: expertise.filter((e) => e.trim() !== ""),
        }),
      });
      if (res.ok) {
        router.push("/admin/instructors");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            {initialData ? "Edit Instructor" : "Add Instructor"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage instructor profile and credentials.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 flex items-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Instructor
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  placeholder="Dr. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                placeholder="Professional background..."
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              Expertise
            </h3>
            <div className="space-y-2">
              {expertise.map((exp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={exp}
                    onChange={(e) => handleExpertiseChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                    placeholder="e.g. Endodontics"
                  />
                  <button
                    type="button"
                    onClick={() => removeExpertise(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExpertise}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Field
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Avatar
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Image URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
            {formData.image && (
              <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </form>
  );
};
