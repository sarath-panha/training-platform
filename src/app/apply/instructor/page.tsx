"use client";

import React from "react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { InstructorApplicationForm } from "@/components/roles/InstructorApplicationForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ApplyInstructorPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth?callbackUrl=/apply/instructor");
    },
  });

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <InstructorApplicationForm />
      </main>
      <Footer />
    </div>
  );
}
