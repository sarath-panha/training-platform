"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Save,
  User,
  Mail,
  Lock,
  Camera,
  Loader2,
  Briefcase,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const UserProfileForm = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [userCategories, setUserCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    confirmPassword: "",
    role: "",
    category: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, catsRes] = await Promise.all([
          fetch("/api/users/profile"),
          fetch("/api/categories?type=user"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
            role: data.role || "",
            category: data.category || "",
          }));
        }

        if (catsRes.ok) {
          setUserCategories(await catsRes.json());
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setFetching(false);
      }
    };

    if (session) fetchProfile();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          password: formData.password,
          category: formData.category,
        }),
      });

      if (res.ok) {
        await update(); // Update session with new data
        alert("Profile updated successfully");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" })); // Clear passwords
        router.refresh();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="p-8 text-center text-slate-500">Loading profile...</div>
    );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-light text-slate-900">
            Account Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your profile and security preferences.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 rounded-lg disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 flex items-center justify-center overflow-hidden relative group border-4 border-white shadow-sm">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Profile Picture URL
              </label>
              <div className="relative">
                <Camera className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 rounded-md transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {formData.role.charAt(0).toUpperCase() +
                  formData.role.slice(1)}{" "}
                Account
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    disabled
                    type="email"
                    value={formData.email}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {formData.role === "participant" && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Profession / Category
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-slate-900 transition-colors appearance-none"
                  >
                    <option value="">Select Category</option>
                    {userCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3">
              Security
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-slate-900 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};
