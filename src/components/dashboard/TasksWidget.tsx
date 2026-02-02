import React from "react";
import { CheckCircle2, AlertCircle, Settings } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Task } from "@/types";

export const TasksWidget = ({ tasks }: { tasks: Task[] }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-normal text-slate-900">Pending Tasks</h3>
      <div className="flex gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mt-2"></span>
      </div>
    </div>

    <Card className="p-0">
      <div className="divide-y divide-slate-100">
        {tasks.map((item) => (
          <div
            key={item.id}
            className="p-5 hover:bg-slate-50 transition-colors flex gap-4"
          >
            <div className="mt-1">
              {item.type === "Approval" && (
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              )}
              {item.type === "Support" && (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              )}
              {item.type === "System" && (
                <Settings className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-slate-900 truncate pr-2">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs text-slate-500 truncate font-medium mb-2">
                {item.requester}
              </p>
              <div className="flex items-center justify-between">
                <Badge type={item.type}>{item.type}</Badge>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wide">
          View All Tickets
        </button>
      </div>
    </Card>
  </section>
);
