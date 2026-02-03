"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Layers,
  ShieldCheck,
  GraduationCap,
  FolderOpen,
  BookUser,
  CreditCard,
  MessageSquare,
  Building2, // For Organizers
  Calendar, // For Events
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Courses", href: "/admin/courses", icon: Layers },
  { label: "Events", href: "/admin/events", icon: Calendar }, // Added
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Instructors", href: "/admin/instructors", icon: GraduationCap },
  { label: "Organizers", href: "/admin/organizers", icon: Building2 }, // Added
  { label: "Enrollments", href: "/admin/enrollments", icon: BookUser },
  { label: "Billing", href: "/admin/billing", icon: CreditCard },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const SidebarItem = ({ icon: Icon, label, href, onClick }: any) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/admin" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 w-full text-sm font-medium transition-all duration-200 rounded-full ${isActive ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "fill-slate-900/0" : ""}`}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-200 w-[280px] transform transition-transform duration-300 ease-in-out lg:translate-x-0 hidden lg:block ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-4 mb-10 pl-2">
          <div className="w-10 h-10 bg-slate-900 rounded-none flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none mb-1">
              Ecodent
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Admin Console
            </span>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};
