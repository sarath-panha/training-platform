import { Schema, Document, models, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  slug: string;
  type: "course" | "user" | "event"; // New field to distinguish category usage
  count: number; // Generic count field
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true }, // slug is unique per type ideally, but simple unique:true is safer globally
    description: { type: String },
    type: {
      type: String,
      enum: ["course", "user", "event"],
      default: "course",
      required: true,
    },
    count: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Ensure slugs are unique per type (compound index)
CategorySchema.index({ slug: 1, type: 1 }, { unique: true });

if (process.env.NODE_ENV === "development") {
  if (models.Category) {
    delete models.Category;
  }
}

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
