"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  ShieldCheck,
  Ticket,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/organizer", icon: LayoutDashboard },
  { label: "My Events", href: "/organizer/events", icon: Calendar },
  { label: "Attendees", href: "/organizer/attendees", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

const SidebarItem = ({ icon: Icon, label, href, onClick }: any) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 w-full text-sm font-medium transition-all duration-200 rounded-full ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
    >
      <Icon
        className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-500"}`}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span>{label}</span>
    </Link>
  );
};

export const OrganizerSidebar = ({
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
}) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-200 w-[280px] transform transition-transform duration-300 ease-in-out lg:translate-x-0 hidden lg:block ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-4 mb-10 pl-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-none flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none mb-1">
              Ecodent
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Organizer Portal
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
