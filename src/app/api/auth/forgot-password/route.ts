import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Always return generic message to prevent user enumeration
    const genericMessage =
      "If an account exists with this email, a password reset link has been sent.";

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return same message even if user not found
      return NextResponse.json({ message: genericMessage }, { status: 200 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Store hashed token with 1-hour expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({ message: genericMessage }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
