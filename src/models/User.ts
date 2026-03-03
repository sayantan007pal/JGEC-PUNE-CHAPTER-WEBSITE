import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  passingYear: string;
  department: string;
  phoneNumber: string;
  nickName?: string;
  currentOrLastOrganization: string;
  designation: string;
  rolesAndResponsibility: string;
  tenure: string;
  addressInPune: string;
  contributionInterest: string;
  bloodGroup: string;
  photoLink: string;
  isEmailVerified: boolean;
  emailVerificationOTP?: string;
  emailVerificationExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    passingYear: {
      type: String,
      required: [true, "Passing year is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number (WhatsApp-enabled) is required"],
    },
    nickName: {
      type: String,
      trim: true,
    },
    currentOrLastOrganization: {
      type: String,
      required: [true, "Current or last organization is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    rolesAndResponsibility: {
      type: String,
      required: [true, "Roles and responsibility is required"],
    },
    tenure: {
      type: String,
      required: [true, "Tenure is required"],
    },
    addressInPune: {
      type: String,
      required: [true, "Address of stay in Pune is required"],
    },
    contributionInterest: {
      type: String,
      required: [true, "Contribution interest is required"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood group is required"],
      enum: {
        values: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        message: "Invalid blood group",
      },
    },
    photoLink: {
      type: String,
      required: [true, "Photo link (Google Drive) is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: hash password only when modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method: compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
