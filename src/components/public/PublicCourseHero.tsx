"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Star,
  Globe,
  Clock,
  Award,
  ShieldCheck,
  User,
  QrCode,
  X,
} from "lucide-react";

interface Props {
  course: any;
  enrollmentStatus: string | null; // Changed from boolean isEnrolled
}

export const PublicCourseHero = ({ course, enrollmentStatus }: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const [showPayment, setShowPayment] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnrollClick = () => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }
    if (course.price === 0) {
      submitEnrollment();
    } else {
      setShowPayment(true);
    }
  };

  const submitEnrollment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course._id,
          transactionId: transactionId || "FREE_COURSE",
        }),
      });

      if (res.ok) {
        setShowPayment(false);
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || "Enrollment failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = enrollmentStatus === "active";
  const isPending = enrollmentStatus === "pending";

  return (
    <div className="bg-slate-900 text-white py-12 md:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShieldCheck className="w-96 h-96" />
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white text-slate-900 rounded-xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Scan to Pay</h3>
              <p className="text-sm text-slate-500 mt-1">
                KHQR Payment for {course.title}
              </p>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example-khqr-payload-for-${course.price}-usd`}
                alt="KHQR Code"
                className="w-48 h-48 mix-blend-multiply"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-colors font-mono text-sm"
                  placeholder="Enter transaction ID from your app"
                />
              </div>

              <button
                onClick={submitEnrollment}
                disabled={!transactionId || loading}
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left: Info */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {typeof course.category === "object"
                  ? course.category.name
                  : "Course"}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> English
              </span>
              <span>
                Last updated {new Date(course.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white">
              {course.title}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              {course.shortDescription}
            </p>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xl">4.8</span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">(124 ratings)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User className="w-4 h-4" />{" "}
                <span>{course.enrollments} Enrolled</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium pt-4">
              <div className="flex -space-x-3">
                {course.instructors?.slice(0, 3).map((inst: any) => (
                  <div
                    key={inst._id}
                    className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-700"
                  >
                    {inst.image ? (
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white bg-slate-600">
                        {inst.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">
                  Created by
                </p>
                <p className="text-white">
                  {course.instructors?.map((i: any) => i.name).join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Pricing Card */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white text-slate-900 rounded-lg shadow-xl overflow-hidden md:sticky md:top-24">
              {course.thumbnail && (
                <div className="aspect-video bg-slate-100 relative group">
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-slate-900 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6 space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">
                    {course.price > 0 ? `$${course.price}` : "Free"}
                  </span>
                  {course.price > 0 && (
                    <span className="text-slate-400 line-through text-sm">
                      ${(course.price * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    disabled
                    className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-default"
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />{" "}
                    Access Granted
                  </button>
                ) : isPending ? (
                  <button
                    disabled
                    className="w-full py-3.5 bg-amber-500 text-white font-bold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />{" "}
                    Verifying...
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    disabled={loading}
                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 shadow-lg shadow-slate-900/20"
                  >
                    {loading
                      ? "Processing..."
                      : course.price > 0
                        ? "Enroll Now"
                        : "Join for Free"}
                  </button>
                )}

                <div className="space-y-3 text-sm text-slate-600 pt-2 border-t border-slate-100">
                  <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    This course includes:
                  </p>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      {course.courseIncludes?.hours || 0} hours on-demand video
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
