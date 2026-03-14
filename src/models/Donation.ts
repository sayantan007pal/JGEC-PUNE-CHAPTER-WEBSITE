import mongoose, { Schema, Document, Model } from "mongoose";

export type DonationStatus = "initiated" | "pending" | "verified" | "rejected";
export type DonationCategory =
  | "scholarship"
  | "infrastructure"
  | "innovation"
  | "alumni_activities"
  | "general";

export const DONATION_CATEGORIES: { value: DonationCategory; label: string }[] =
  [
    { value: "scholarship", label: "Student Scholarships" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "innovation", label: "Innovation Fund" },
    { value: "alumni_activities", label: "Alumni Activities" },
    { value: "general", label: "General Donation" },
  ];

export interface IDonation extends Document {
  // ── Phase 1: Created at /initiate ──────────────────────────
  userId: mongoose.Types.ObjectId;
  amount: number;
  donationCategory: DonationCategory;
  paymentRequestRef: string;
  payment_type: string;
  validation_type: string;
  upiId: string;
  upiPayeeName: string;
  status: DonationStatus;
  isVerified: boolean;

  // ── Phase 2: Updated at /[donationId]/proof ─────────────────
  utr?: string;
  payeeUpi?: string;
  proofImageUrl?: string;
  proofImagePublicId?: string;
  donorMessage?: string;
  proofSubmittedAt?: Date;

  // ── Phase 3: Set at admin action ────────────────────────────
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verificationDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    // Phase 1
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    donationCategory: {
      type: String,
      enum: [
        "scholarship",
        "infrastructure",
        "innovation",
        "alumni_activities",
        "general",
      ],
      default: "general",
      required: [true, "Donation category is required"],
      index: true,
    },
    paymentRequestRef: {
      type: String,
      required: [true, "Payment request reference is required"],
      trim: true,
      index: true,
    },
    payment_type: {
      type: String,
      enum: ["upi"],
      default: "upi",
      required: true,
    },
    validation_type: {
      type: String,
      enum: ["manual"],
      default: "manual",
      required: true,
    },
    upiId: {
      type: String,
      required: [true, "UPI ID snapshot is required"],
      trim: true,
    },
    upiPayeeName: {
      type: String,
      required: [true, "UPI payee name snapshot is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["initiated", "pending", "verified", "rejected"],
      // existing records (already have proof) should default to 'pending'
      default: "pending",
      required: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Phase 2
    utr: {
      type: String,
      trim: true,
      index: true,
    },
    payeeUpi: {
      type: String,
      trim: true,
    },
    proofImageUrl: {
      type: String,
      trim: true,
    },
    proofImagePublicId: {
      type: String,
      trim: true,
    },
    donorMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Donor message can be at most 500 characters"],
    },
    proofSubmittedAt: {
      type: Date,
    },

    // Phase 3
    verificationNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Verification notes can be at most 1000 characters"],
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verificationDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Compound indexes
donationSchema.index({ userId: 1, status: 1 });
donationSchema.index({ userId: 1, createdAt: -1 });

const Donation: Model<IDonation> =
  mongoose.models.Donation ||
  mongoose.model<IDonation>("Donation", donationSchema);

export default Donation;
