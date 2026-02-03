import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "participant" | "instructor" | "organizer" | "admin";
  category?: mongoose.Types.ObjectId; // E.g., 'Dentist', 'Student'
  provider: "credentials" | "google";
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    role: {
      type: String,
      enum: ["participant", "instructor", "organizer", "admin"],
      default: "participant",
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    provider: { type: String, default: "credentials" },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.User) {
    delete models.User;
  }
}

const User = models.User || model<IUser>("User", UserSchema);

export default User;
