import React from "react";

export interface Course {
  _id: string;
  title: string;
  thumbnail?: string;
  instructors: any[]; // Can be IDs strings or Populated Objects
  shortDescription?: string;
  description?: string;
  learningOutcomes?: string[];
  requirements?: string[];
  courseIncludes?: {
    hours: number;
    articles: number;
    downloads: number;
    mobileAccess: boolean;
    certificate: boolean;
    closedCaptions: boolean;
  };
  enrollments: number;
  revenue: string;
  status: "Published" | "Draft" | "Review";
  thumbnailColor?: string;
  category: string;
  chapters?: {
    title: string;
    videos: { title: string; url: string; duration?: string }[];
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
}

export interface Task {
  id: string;
  title: string;
  requester: string;
  time: string;
  type: "Approval" | "Support" | "System";
}
