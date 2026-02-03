"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  User,
  Briefcase,
  Video,
  FileText,
  Linkedin,
  Phone,
  Globe,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const InstructorApplicationForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expertiseList, setExpertiseList] = useState<string[]>([""]);

  const [formData, setFormData] = useState({
    phone: "",
    linkedin: "",
    website: "",
    bio: "",
    experienceYears: 0,
    sampleVideoUrl: "",
    resumeUrl: "",
  });

  const handleListChange = (index: number, value: string) => {
    const newList = [...expertiseList];
    newList[index] = value;
    setExpertiseList(newList);
  };

  const addExpertise = () => setExpertiseList([...expertiseList, ""]);
  const removeExpertise = (index: number) =>
    setExpertiseList(expertiseList.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/role-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedRole: "instructor",
          ...formData,
          expertise: expertiseList.filter((e) => e.trim() !== ""),
        }),
      });

      if (res.ok) {
        alert(
          "Application submitted successfully! We will review your profile.",
        );
        router.push("/");
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-slate-900">
          Become an Instructor
        </h2>
        <p className="text-slate-500">
          Share your dental expertise with thousands of students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Identity */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">
                Professional Identity
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                Professional Bio
              </label>
              <textarea
                required
                rows={5}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                placeholder="Tell us about your background, specializations, and teaching philosophy..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceYears: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedin: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                    placeholder="[https://linkedin.com/in/](https://linkedin.com/in/)..."
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Expertise & Content */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 h-full">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">
                Key Expertise
              </h3>
            </div>

            <div className="space-y-2">
              {expertiseList.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleListChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none rounded-lg"
                    placeholder="e.g. Oral Surgery"
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

        {/* Contact & Samples */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 h-full">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-medium text-slate-900">
                Verification
              </h3>
            </div>

            <div className="space-y-4">
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

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Sample Teaching Video (URL)
                </label>
                <div className="relative">
                  <Video className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.sampleVideoUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sampleVideoUrl: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                    placeholder="YouTube / Vimeo link"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Resume / CV (URL)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, resumeUrl: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-lg"
                    placeholder="Link to PDF/Drive"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="pt-4">
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
        <p className="text-center text-xs text-slate-500 mt-4">
          By submitting, you agree to our Instructor Terms and Conditions.
        </p>
      </div>
    </form>
  );
};
