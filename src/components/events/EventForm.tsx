"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Calendar,
  MapPin,
  Image as ImageIcon,
  DollarSign,
  Users,
  Type,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const EventForm = ({ initialData }: { initialData?: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    thumbnail: initialData?.thumbnail || "",
    category: initialData?.category?._id || initialData?.category || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    location: initialData?.location || "Online",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "",
    price: initialData?.price || 0,
    capacity: initialData?.capacity || 100,
    status: initialData?.status || "Draft",
  });

  useEffect(() => {
    fetch("/api/categories?type=event")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = !!initialData?._id;
    const url = isEdit
      ? `/api/organizer/events/${initialData._id}`
      : "/api/organizer/events";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/organizer/events");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-slate-900">
          {initialData ? "Edit Event" : "Create Event"}
        </h2>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 flex items-center gap-2 shadow-sm rounded-lg"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Event
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              Event Details
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Event Title
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Thumbnail URL
              </label>
              <div className="flex gap-2 relative">
                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => handleChange("thumbnail", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Logistics
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
              >
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
                  placeholder="Online or City"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Capacity
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleChange("capacity", e.target.value)}
                    className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-md"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};
