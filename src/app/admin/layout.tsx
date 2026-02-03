import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Client-side wrapper for state (Sidebar open/close)
import { AdminStateWrapper } from "./AdminStateWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 1. Check if user is logged in
  if (!session) {
    redirect("/auth?callbackUrl=/admin");
  }

  // 2. Check if user has admin privileges
  if (session.user.role !== "admin") {
    // Optionally redirect to a "Not Authorized" page or Home
    redirect("/");
  }

  return <AdminStateWrapper>{children}</AdminStateWrapper>;
}
