import React from "react";
import { Star, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const ReviewStats = ({ reviews }: { reviews: any[] }) => {
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "0.0";

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-5 flex items-center gap-4 bg-amber-50/50 border-amber-100">
        <div className="p-3 bg-amber-100 rounded-full text-amber-600">
          <Star className="w-6 h-6 fill-current" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Avg. Rating
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{avgRating}</h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="p-3 bg-slate-100 rounded-full text-slate-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Reviews
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{totalReviews}</h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pending
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{pendingCount}</h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4">
        <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
          <ThumbsUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Approved
          </p>
          <h3 className="text-2xl font-bold text-slate-900">{approvedCount}</h3>
        </div>
      </Card>
    </div>
  );
};
