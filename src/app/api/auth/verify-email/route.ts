import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Find user with OTP fields
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+emailVerificationOTP +emailVerificationExpiry");

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    if (!user.emailVerificationOTP || !user.emailVerificationExpiry) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > user.emailVerificationExpiry) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Compare OTP
    const isOTPValid = await bcrypt.compare(otp.toString(), user.emailVerificationOTP);
    if (!isOTPValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Mark email as verified and clear OTP fields
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Send welcome email with WhatsApp link
    await sendWelcomeEmail(user.email, user.fullName);

    return NextResponse.json(
      { message: "Email verified successfully! Welcome to JGEC Alumni Pune." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
