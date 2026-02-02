import { DollarSign, Users, TrendingUp } from "lucide-react";
import { Course, Stat, Task } from "@/types";

export const COURSES: Course[] = [
  {
    id: "1",
    title: "Advanced Endodontics: Root Canal Therapy",
    instructor: "Dr. Sarah Chen",
    enrollments: 1240,
    revenue: "$124,000",
    status: "Published",
    thumbnailColor: "bg-indigo-50",
    category: "Endodontics",
  },
  {
    id: "2",
    title: "Digital Impressions & CAD/CAM",
    instructor: "Dr. Michael Ross",
    enrollments: 856,
    revenue: "$85,600",
    status: "Published",
    thumbnailColor: "bg-emerald-50",
    category: "Prosthodontics",
  },
  {
    id: "3",
    title: "Pediatric Behavior Management",
    instructor: "Dr. Emily Watson",
    enrollments: 0,
    revenue: "$0",
    status: "Draft",
    thumbnailColor: "bg-orange-50",
    category: "Pediatric",
  },
  {
    id: "4",
    title: "Implant Surgery Basics",
    instructor: "Dr. Alan Grant",
    enrollments: 0,
    revenue: "$0",
    status: "Review",
    thumbnailColor: "bg-blue-50",
    category: "Surgery",
  },
];

export const STATS: Stat[] = [
  {
    id: "1",
    label: "Total Revenue",
    value: "$482.5k",
    trend: "+12% vs last month",
    trendUp: true,
    icon: DollarSign,
  },
  {
    id: "2",
    label: "Active Learners",
    value: "2,405",
    trend: "+180 this week",
    trendUp: true,
    icon: Users,
  },
  {
    id: "3",
    label: "Course Completion",
    value: "84%",
    trend: "Top 5% of industry",
    trendUp: true,
    icon: TrendingUp,
  },
];

export const PENDING_TASKS: Task[] = [
  {
    id: "1",
    title: "New Instructor Application",
    requester: "Dr. John Doe",
    time: "2 hrs ago",
    type: "Approval",
  },
  {
    id: "2",
    title: "Course Content Review",
    requester: "Implant Surgery Basics",
    time: "5 hrs ago",
    type: "System",
  },
  {
    id: "3",
    title: "Payment Gateway Alert",
    requester: "System",
    time: "1 day ago",
    type: "Support",
  },
];
