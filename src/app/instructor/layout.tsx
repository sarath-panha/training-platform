"use client";

import React, { useState } from "react";
import { InstructorSidebar } from "@/components/layout/InstructorSidebar";
import { Header } from "@/components/layout/Header"; // Reusing existing Header
import { MobileNav } from "@/components/layout/MobileNav"; // Reusing existing MobileNav

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-[80px] lg:pb-0">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Instructor Specific Sidebar */}
      <InstructorSidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        {/* Reuse Header, adjust title logic inside Header if needed or pass props */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
