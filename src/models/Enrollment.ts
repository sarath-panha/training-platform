import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  completedLessons: string[];
  progress: number;
  status: "pending" | "active" | "rejected"; // New field
  transactionId?: string; // New field
}

const EnrollmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedLessons: { type: [String], default: [] },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },
    transactionId: { type: String },
  },
  { timestamps: true },
);

// Prevent duplicate enrollments
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

if (process.env.NODE_ENV === "development") {
  if (models.Enrollment) delete models.Enrollment;
}

const Enrollment =
  models.Enrollment || model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
