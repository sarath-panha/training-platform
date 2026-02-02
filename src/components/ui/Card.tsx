import React from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-none border border-slate-200 p-6 ${className}`}
  >
    {children}
  </div>
);
