"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Briefcase,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "participant", // Default role
    category: "", // User category ID (e.g. Dentist ID)
  });

  const [userCategories, setUserCategories] = useState<any[]>([]);

  // Fetch user categories when switching to register mode
  useEffect(() => {
    if (!isLogin && userCategories.length === 0) {
      fetch("/api/categories?type=user")
        .then((res) => res.json())
        .then((data) => setUserCategories(data))
        .catch((err) => console.error("Failed to load user categories", err));
    }
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
          });
          router.push("/");
          router.refresh();
        } else {
          const data = await res.json();
          setError(data.error || "Registration failed");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-none">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">Ecodent</span>
        </Link>
        <h2 className="text-center text-2xl font-light text-slate-900">
          {isLogin ? "Sign in to your account" : "Create your free account"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            {isLogin ? "join for free today" : "sign in to existing account"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="block w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    placeholder="Dr. Jane Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                      I am a...
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    >
                      <option value="participant">Participant</option>
                      <option value="instructor">Instructor</option>
                      <option value="organizer">Organizer</option>
                    </select>
                  </div>

                  {form.role === "participant" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                        Profession
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        className="block w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                      >
                        <option value="">Select...</option>
                        {userCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="block w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="block w-full px-3 py-2 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}{" "}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center py-2.5 px-4 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {/* SVG Icon from previous snippet */}
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
