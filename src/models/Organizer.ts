import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IOrganizer extends Document {
  user: mongoose.Types.ObjectId;
  name: string; // Organization or Personal Name
  email: string;
  phone: string;
  image: string;
  website: string;
  bio: string; // Description of organization
  eventTypes: string[];
  eventsCount: number;
}

const OrganizerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    image: { type: String },
    website: { type: String },
    bio: { type: String },
    eventTypes: { type: [String], default: [] },
    eventsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  if (models.Organizer) delete models.Organizer;
}

const Organizer =
  models.Organizer || model<IOrganizer>("Organizer", OrganizerSchema);

export default Organizer;
