import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IRoleRequest extends Document {
  user: mongoose.Types.ObjectId;
  requestedRole: "instructor" | "organizer";
  status: "pending" | "approved" | "rejected";

  // Common Fields
  phone: string;
  website?: string;
  linkedin?: string;

  // Instructor Specific
  bio?: string;
  expertise?: string[];
  experienceYears?: number;
  sampleVideoUrl?: string; // For teaching style review
  resumeUrl?: string;

  // Organizer Specific
  organizationName?: string;
  eventTypes?: string[]; // e.g., Workshops, Seminars
  pastEventsDescription?: string;

  createdAt: Date;
}

const RoleRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedRole: {
      type: String,
      enum: ["instructor", "organizer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Contact
    phone: { type: String, required: true },
    website: { type: String },
    linkedin: { type: String },

    // Instructor Data
    bio: { type: String },
    expertise: { type: [String], default: [] },
    experienceYears: { type: Number },
    sampleVideoUrl: { type: String },
    resumeUrl: { type: String },

    // Organizer Data
    organizationName: { type: String },
    eventTypes: { type: [String], default: [] },
    pastEventsDescription: { type: String },
  },
  { timestamps: true },
);

// Prevent duplicate pending requests
RoleRequestSchema.index({ user: 1, status: 1 }, { unique: false });

if (process.env.NODE_ENV === "development") {
  if (models.RoleRequest) {
    delete models.RoleRequest;
  }
}

const RoleRequest =
  models.RoleRequest || model<IRoleRequest>("RoleRequest", RoleRequestSchema);

export default RoleRequest;
