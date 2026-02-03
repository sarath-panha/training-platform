"use client";

import React, { useState } from "react";
import { OrganizerSidebar } from "@/components/layout/OrganizerSidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-[80px] lg:pb-0">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <OrganizerSidebar isSidebarOpen={isSidebarOpen} />
      <main className="lg:ml-[280px] min-h-screen transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
