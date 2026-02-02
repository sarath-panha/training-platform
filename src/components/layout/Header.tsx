"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  HelpCircle,
  Bell,
  User,
  LogOut,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

// Helper to get title from path
const getTitle = (path: string) => {
  if (path === "/admin") return "Overview";
  if (path.startsWith("/admin/courses")) return "Courses";
  if (path.startsWith("/admin/categories")) return "Categories";
  if (path.startsWith("/admin/users")) return "Users";
  if (path.startsWith("/admin/analytics")) return "Analytics";
  if (path.startsWith("/admin/settings")) return "Settings";
  return "Dashboard";
};

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const title = getTitle(pathname || "");

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200 lg:border-none">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-600"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Brand for Header */}
        <div className="lg:hidden flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-none flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-normal text-slate-900 hidden lg:block tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <IconButton icon={Search} />
        <IconButton icon={HelpCircle} />
        <IconButton icon={Bell} />

        {/* User Profile Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-slate-200/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent"
          >
            <img
              src="images/avatar.jpg"
              alt="User"
              className="w-8 h-8 rounded-full border border-slate-200 bg-white"
            />
            <span className="hidden md:block text-sm font-medium text-slate-700">
              Admin User
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
