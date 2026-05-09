import mongoose, { Schema, Document, Model } from "mongoose";

export type ContactMessageStatus = "unread" | "read" | "resolved";

export interface IContactMessage extends Document {
  // Sender info
  name: string;
  email: string;
  phone?: string;
  batch?: string;

  // Message content
  subject: string;
  message: string;

  // Honeypot field for spam detection (should be empty)
  website?: string;

  // Status tracking
  status: ContactMessageStatus;

  // Admin reply
  replyMessage?: string;
  repliedBy?: mongoose.Types.ObjectId;
  repliedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    // Sender info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    batch: {
      type: String,
      trim: true,
      maxlength: [10, "Batch year cannot exceed 10 characters"],
    },

    // Message content
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },

    // Honeypot field - should always be empty for real users
    website: {
      type: String,
      trim: true,
    },

    // Status
    status: {
      type: String,
      enum: ["unread", "read", "resolved"],
      default: "unread",
      index: true,
    },

    // Admin reply
    replyMessage: {
      type: String,
      trim: true,
      maxlength: [5000, "Reply cannot exceed 5000 characters"],
    },
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ createdAt: -1 });

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);

export default ContactMessage;
