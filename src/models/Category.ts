import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  courseCount: number;
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    courseCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.Category) {
    delete models.Category;
  }
}

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
