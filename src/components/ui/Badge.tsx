import React from "react";
import { Course, Task } from "@/types";

export const Badge = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type: Course["status"] | Task["type"];
}) => {
  const styles: Record<string, string> = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft: "bg-slate-50 text-slate-600 border-slate-200",
    Review: "bg-amber-50 text-amber-700 border-amber-200",
    Approval: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Support: "bg-rose-50 text-rose-700 border-rose-200",
    System: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-none font-bold border ${styles[type] || styles.System}`}
    >
      {children}
    </span>
  );
};
