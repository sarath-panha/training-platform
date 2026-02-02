import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin" | "instructor";
  provider: "credentials" | "google";
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth
    image: { type: String },
    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },
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
