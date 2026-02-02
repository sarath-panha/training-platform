import React from "react";
import { Card } from "@/components/ui/Card";

export const SystemStatus = () => (
  <Card className="bg-slate-900 text-white border-none p-6">
    <h3 className="text-lg font-medium mb-4">System Status</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Server Load</span>
        <span className="font-bold text-emerald-400">Normal (12%)</span>
      </div>
      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
        <div className="bg-emerald-400 h-full w-[12%]"></div>
      </div>

      <div className="flex items-center justify-between text-sm pt-2">
        <span className="text-slate-400">Storage Usage</span>
        <span className="font-bold text-amber-400">Warning (85%)</span>
      </div>
      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
        <div className="bg-amber-400 h-full w-[85%]"></div>
      </div>
    </div>
    <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-none text-xs font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest">
      Run Diagnostics
    </button>
  </Card>
);
