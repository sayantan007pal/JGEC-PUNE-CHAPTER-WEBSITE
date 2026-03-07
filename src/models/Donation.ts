import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonation extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  utr: string;
  payeeUpi?: string;
  paymentRequestRef: string;
  payment_type: "upi";
  validation_type: "manual";
  isVerified: boolean;
  upiId: string;
  upiPayeeName: string;
  proofImageUrl: string;
  proofImagePublicId: string;
  donorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
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
    utr: {
      type: String,
      required: [true, "UTR is required"],
      trim: true,
      index: true,
    },
    payeeUpi: {
      type: String,
      trim: true,
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
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
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
    proofImageUrl: {
      type: String,
      required: [true, "Proof image URL is required"],
      trim: true,
    },
    proofImagePublicId: {
      type: String,
      required: [true, "Proof image public ID is required"],
      trim: true,
    },
    donorMessage: {
      type: String,
      trim: true,
      maxlength: [500, "Donor message can be at most 500 characters"],
    },
  },
  { timestamps: true },
);

const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", donationSchema);

export default Donation;
