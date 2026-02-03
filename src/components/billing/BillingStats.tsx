import React from "react";
import { DollarSign, TrendingUp, Clock, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const BillingStats = ({ records }: { records: any[] }) => {
  const totalRevenue = records
    .filter((r) => r.status === "active")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingRevenue = records
    .filter((r) => r.status === "pending")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalTransactions = records.length;
  const recentTransactions = records.filter((r) => {
    const date = new Date(r.enrolledAt);
    const now = new Date();
    return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) < 7; // Last 7 days
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-5 flex items-center gap-4 bg-emerald-50/50 border-emerald-100">
        <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Revenue
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            ${totalRevenue.toLocaleString()}
          </h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4 bg-amber-50/50 border-amber-100">
        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pending
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            ${pendingRevenue.toLocaleString()}
          </h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="p-3 bg-slate-100 rounded-full text-slate-600">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Transactions
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            {totalTransactions}
          </h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            This Week
          </p>
          <h3 className="text-2xl font-bold text-slate-900">
            +{recentTransactions}
          </h3>
        </div>
      </Card>
    </div>
  );
};
