import mongoose, { Schema, Document, models, model } from "mongoose";

const VideoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String },
});

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  videos: [VideoSchema],
});

export interface ICourse extends Document {
  title: string;
  thumbnail: string;
  instructors: mongoose.Types.ObjectId[];
  shortDescription: string;
  description: string;
  learningOutcomes: string[];
  requirements: string[];
  courseIncludes: {
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
  thumbnailColor: string;
  category: string;
  chapters: {
    title: string;
    videos: { title: string; url: string; duration?: string }[];
  }[];
  createdAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String },

    // Updated Reference
    instructors: [{ type: Schema.Types.ObjectId, ref: "Instructor" }],

    shortDescription: { type: String },
    description: { type: String },
    learningOutcomes: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    courseIncludes: {
      hours: { type: Number, default: 0 },
      articles: { type: Number, default: 0 },
      downloads: { type: Number, default: 0 },
      mobileAccess: { type: Boolean, default: true },
      certificate: { type: Boolean, default: true },
      closedCaptions: { type: Boolean, default: true },
    },
    enrollments: { type: Number, default: 0 },
    revenue: { type: String, default: "$0" },
    status: {
      type: String,
      enum: ["Published", "Draft", "Review"],
      default: "Draft",
    },
    thumbnailColor: { type: String, default: "bg-slate-50" },
    category: { type: String, required: true },
    chapters: [ChapterSchema],
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.Course) {
    delete models.Course;
  }
}

const Course = models.Course || model<ICourse>("Course", CourseSchema);

export default Course;
