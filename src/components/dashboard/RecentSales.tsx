import React from "react";
import { User, Clock } from "lucide-react";

interface Enrollment {
  _id: string;
  user: { name: string; email: string; image?: string };
  course: { title: string; price: number };
  amount: number;
  enrolledAt: string;
}

export const RecentSales = ({ sales }: { sales: Enrollment[] }) => {
  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <div
          key={sale._id}
          className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {sale.user?.image ? (
              <img
                src={sale.user.image}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User className="w-4 h-4" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-900">
                {sale.user?.name || "Unknown User"}
              </p>
              <p className="text-xs text-slate-500">{sale.user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">
              +${(sale.amount ?? 0).toFixed(2)}
            </p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{new Date(sale.enrolledAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
      {sales.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No recent sales
        </div>
      )}
    </div>
  );
};
