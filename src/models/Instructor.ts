import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IInstructor extends Document {
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  image: string;
  rating: number;
  students: number;
  coursesCount: number;
}

const InstructorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String },
    expertise: { type: [String], default: [] },
    image: { type: String },
    rating: { type: Number, default: 4.8 },
    students: { type: Number, default: 0 },
    coursesCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.Instructor) {
    delete models.Instructor;
  }
}

const Instructor =
  models.Instructor || model<IInstructor>("Instructor", InstructorSchema);

export default Instructor;
