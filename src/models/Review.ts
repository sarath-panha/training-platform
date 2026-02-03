import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Prevent multiple reviews per user per course
ReviewSchema.index({ user: 1, course: 1 }, { unique: true });

if (process.env.NODE_ENV === "development") {
  if (models.Review) delete models.Review;
}

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
