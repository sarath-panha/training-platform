import React from "react";

export const IconButton = ({
  icon: Icon,
  onClick,
  className = "",
}: {
  icon: React.ElementType;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors ${className}`}
  >
    <Icon className="w-6 h-6" strokeWidth={1.5} />
  </button>
);
