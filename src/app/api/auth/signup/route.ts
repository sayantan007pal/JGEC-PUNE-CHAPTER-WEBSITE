import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Connect to database
    console.log("[SIGNUP] Step 1: Connecting to database...");
    await dbConnect();
    console.log("[SIGNUP] Step 1: Database connected successfully.");

    // STEP 2: Parse request body
    console.log("[SIGNUP] Step 2: Parsing request body...");
    const body = await request.json();
    console.log("[SIGNUP] Step 2: Body parsed. Keys:", Object.keys(body));

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

    // STEP 3: Validate required fields
    console.log("[SIGNUP] Step 3: Validating required fields...");
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
    console.log("[SIGNUP] Step 3: All required fields present.");

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

    // STEP 4: Check if user already exists
    console.log("[SIGNUP] Step 4: Checking for existing user with email:", email.toLowerCase());
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }
    console.log("[SIGNUP] Step 4: No existing user found.");

    // STEP 5: Generate OTP
    console.log("[SIGNUP] Step 5: Generating OTP...");
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log("[SIGNUP] Step 5: OTP generated and hashed.");

    // STEP 6: Create user
    console.log("[SIGNUP] Step 6: Creating user in database...");
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
    console.log("[SIGNUP] Step 6: User created successfully. ID:", user._id);

    // STEP 7: Send verification email
    console.log("[SIGNUP] Step 7: Sending verification email to:", user.email);
    try {
      await sendVerificationEmail(user.email, otp);
      console.log("[SIGNUP] Step 7: Verification email sent successfully.");
    } catch (emailError) {
      console.error("[SIGNUP] Step 7: FAILED to send verification email:", emailError);
      // Still return success since user was created - they can resend OTP later
      return NextResponse.json(
        {
          message: "Account created successfully. There was an issue sending the verification email. Please use the 'Resend OTP' option.",
          email: user.email,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: "Account created successfully. Please check your email for the verification code.",
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[SIGNUP] ERROR - Full error:", error);
    console.error("[SIGNUP] ERROR - Name:", error instanceof Error ? error.name : "unknown");
    console.error("[SIGNUP] ERROR - Message:", error instanceof Error ? error.message : String(error));
    console.error("[SIGNUP] ERROR - Stack:", error instanceof Error ? error.stack : "no stack");

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Return detailed error in development/debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Internal server error. Please try again later.",
        debug: errorMessage,
      },
      { status: 500 }
    );
  }
}

