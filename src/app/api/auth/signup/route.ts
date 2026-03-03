import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      fullName,
      email,
      password,
      passingYear,
      department,
      phoneNumber,
      nickName,
      currentOrLastOrganization,
      designation,
      rolesAndResponsibility,
      tenureStartDate,
      tenureEndDate,
      isCurrentlyWorking,
      addressInPune,
      contributionInterest,
      bloodGroup,
      photoLink,
    } = body;

    // Validate required fields
    const requiredFields = {
      fullName,
      email,
      password,
      passingYear,
      department,
      phoneNumber,
      currentOrLastOrganization,
      designation,
      rolesAndResponsibility,
      tenureStartDate,
      addressInPune,
      contributionInterest,
      bloodGroup,
      photoLink,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || (typeof value === "string" && value.trim() === ""))
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      passingYear: passingYear.trim(),
      department: department.trim(),
      phoneNumber: phoneNumber.trim(),
      nickName: nickName?.trim() || undefined,
      currentOrLastOrganization: currentOrLastOrganization.trim(),
      designation: designation.trim(),
      rolesAndResponsibility: rolesAndResponsibility.trim(),
      tenureStartDate: tenureStartDate.trim(),
      tenureEndDate: tenureEndDate?.trim() || undefined,
      isCurrentlyWorking: Boolean(isCurrentlyWorking),
      addressInPune: addressInPune.trim(),
      contributionInterest: contributionInterest.trim(),
      bloodGroup,
      photoLink: photoLink.trim(),
      isEmailVerified: false,
      emailVerificationOTP: hashedOTP,
      emailVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send verification email
    await sendVerificationEmail(user.email, otp);

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email for the verification code.",
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
