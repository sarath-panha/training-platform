import mongoose, { Schema, Document, models, model } from "mongoose";

const VideoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String },
  isPreview: { type: Boolean, default: false }, // New field
});

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  videos: [VideoSchema],
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String },
    instructors: [{ type: Schema.Types.ObjectId, ref: "Instructor" }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, default: 0 },
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
    chapters: [ChapterSchema],
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.Course) delete models.Course;
}

const Course = models.Course || model("Course", CourseSchema);

export default Course;
