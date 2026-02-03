"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Building2,
  Calendar,
  Phone,
  Globe,
  Loader2,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const OrganizerApplicationForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    phone: "",
    website: "",
    pastEventsDescription: "",
    eventTypes: [] as string[],
  });

  const handleEventType = (type: string) => {
    const current = formData.eventTypes;
    if (current.includes(type)) {
      setFormData({
        ...formData,
        eventTypes: current.filter((t) => t !== type),
      });
    } else {
      setFormData({ ...formData, eventTypes: [...current, type] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/role-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedRole: "organizer",
          ...formData,
        }),
      });

      if (res.ok) {
        alert(
          "Application submitted! We will review your organization details.",
        );
        router.push("/");
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-slate-900">
          Become an Organizer
        </h2>
        <p className="text-slate-500">
          Host dental events, workshops, and seminars.
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900">
              Organization Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Organization / Clinic Name
              </label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                placeholder="e.g. Global Dental Summit"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900">
              Event Experience
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">
              Event Types You Plan to Host
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "Conference",
                "Workshop",
                "Webinar",
                "Seminar",
                "Hands-on Training",
              ].map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition-all ${formData.eventTypes.includes(type) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.eventTypes.includes(type)}
                    onChange={() => handleEventType(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Past Events & Experience
            </label>
            <textarea
              required
              rows={4}
              value={formData.pastEventsDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pastEventsDescription: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
              placeholder="Describe your previous experience in organizing events..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-slate-900 text-white font-bold text-lg rounded-lg hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Submit Application"
          )}
        </button>
      </Card>
    </form>
  );
};
