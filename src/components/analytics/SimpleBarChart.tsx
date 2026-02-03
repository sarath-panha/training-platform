import React from "react";

interface DataPoint {
  label: string;
  value: number;
}

export const SimpleBarChart = ({ data }: { data: DataPoint[] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = 200;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-end justify-between gap-2 h-[240px] pt-8 pb-2 min-w-[300px]">
        {data.map((point, index) => {
          const height =
            maxValue > 0 ? (point.value / maxValue) * chartHeight : 0;
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white text-xs rounded px-2 py-1 transition-opacity whitespace-nowrap z-10">
                ${point.value.toLocaleString()}
              </div>

              {/* Bar */}
              <div
                className="w-full max-w-[40px] bg-slate-200 rounded-t-sm group-hover:bg-indigo-600 transition-all duration-500 relative"
                style={{ height: `${height}px` }}
              ></div>

              {/* Label */}
              <span className="text-xs text-slate-500 mt-3 font-medium">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
