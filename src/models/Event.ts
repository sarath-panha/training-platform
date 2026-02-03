import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  thumbnail: string;
  organizer: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  description: string;
  shortDescription: string;
  location: string; // e.g. "Online" or "Phnom Penh"
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  registeredCount: number;
  status: "Draft" | "Published" | "Cancelled";
}

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" }, // type='event'
    description: { type: String },
    shortDescription: { type: String },
    location: { type: String, default: "Online" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    price: { type: Number, default: 0 },
    capacity: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Published", "Cancelled"],
      default: "Draft",
    },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.Event) delete models.Event;
}

const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
