"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const BottomNavItem = ({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/admin" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 min-w-[64px] group"
    >
      <div
        className={`
        w-16 h-8 rounded-full flex items-center justify-center transition-colors duration-200
        ${isActive ? "bg-slate-200" : "bg-transparent group-hover:bg-slate-50"}
      `}
      >
        <Icon
          className={`w-6 h-6 transition-colors ${isActive ? "text-slate-900" : "text-slate-500"}`}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </div>
      <span
        className={`text-[12px] font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-500"}`}
      >
        {label}
      </span>
    </Link>
  );
};

export const MobileNav = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-[80px] z-50 flex justify-evenly items-center px-2 shadow-lg">
    <BottomNavItem icon={LayoutDashboard} label="Overview" href="/admin" />
    <BottomNavItem icon={Layers} label="Courses" href="/admin/courses" />
    <BottomNavItem icon={Users} label="Users" href="/admin/users" />
    <BottomNavItem icon={BarChart3} label="Analytics" href="/admin/analytics" />
    <BottomNavItem icon={Settings} label="Settings" href="/admin/settings" />
  </div>
);
