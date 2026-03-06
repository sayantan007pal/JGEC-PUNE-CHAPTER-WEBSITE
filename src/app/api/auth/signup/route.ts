import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { MAX_PHOTO_SIZE } from "@/constants/user";

export async function POST(request: NextRequest) {
  let photoPublicId: string | undefined; // will be used to delete the photo if user creation fails
  try {
    // STEP 1: Connect to database
    console.log("[SIGNUP] Step 1: Connecting to database...");
    await dbConnect();
    console.log("[SIGNUP] Step 1: Database connected successfully.");

    // STEP 2: Parse multipart/form-data
    console.log("[SIGNUP] Step 2: Parsing multipart form data...");
    const formData = await request.formData();
    console.log("[SIGNUP] Step 2: Form data parsed.");

    const getString = (key: string): string =>
      (formData.get(key) as string | null)?.trim() ?? "";

    const fullName = getString("fullName");
    const email = getString("email");
    const password = getString("password");
    const passingYear = getString("passingYear");
    const department = getString("department");
    const phoneNumber = getString("phoneNumber");
    const nickName = getString("nickName");
    const currentOrLastOrganization = getString("currentOrLastOrganization");
    const designation = getString("designation");
    const rolesAndResponsibility = getString("rolesAndResponsibility");
    const tenureStartDate = getString("tenureStartDate");
    const tenureEndDate = getString("tenureEndDate");
    const isCurrentlyWorking = formData.get("isCurrentlyWorking") === "true";
    const addressInPune = getString("addressInPune");
    const contributionInterest = getString("contributionInterest");
    const bloodGroup = getString("bloodGroup");
    const photoFile = formData.get("photo") as File | null;

    // STEP 3: Validate required text fields
    console.log("[SIGNUP] Step 3: Validating required fields...");
    const requiredFields: Record<string, string> = {
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
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value || value === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate photo
    if (!photoFile || photoFile.size === 0) {
      return NextResponse.json(
        { error: "A profile photo is required" },
        { status: 400 },
      );
    }
    if (!photoFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Uploaded file must be an image" },
        { status: 400 },
      );
    }
    if (photoFile.size > MAX_PHOTO_SIZE) {
      return NextResponse.json(
        { error: `Photo must be ${MAX_PHOTO_SIZE / (1024 * 1024)} MB or smaller` },
        { status: 400 },
      );
    }
    console.log("[SIGNUP] Step 3: All required fields present.");

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Password length check
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // STEP 4: Check if user already exists
    console.log(
      "[SIGNUP] Step 4: Checking for existing user with email:",
      email.toLowerCase(),
    );
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }
    console.log("[SIGNUP] Step 4: No existing user found.");

    // STEP 5: Upload photo to Cloudinary
    console.log("[SIGNUP] Step 5: Uploading photo to Cloudinary...");
    const { secure_url: photoUrl, public_id } = await uploadToCloudinary(photoFile, fullName);
    photoPublicId = public_id;
    console.log("[SIGNUP] Step 5: Photo uploaded successfully:", photoUrl);

    // STEP 6: Generate OTP
    console.log("[SIGNUP] Step 6: Generating OTP...");
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    console.log("[SIGNUP] Step 6: OTP generated and hashed.");

    // STEP 7: Create user
    console.log("[SIGNUP] Step 7: Creating user in database...");
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      passingYear,
      department,
      phoneNumber,
      nickName: nickName || undefined,
      currentOrLastOrganization,
      designation,
      rolesAndResponsibility,
      tenureStartDate,
      tenureEndDate: tenureEndDate || undefined,
      isCurrentlyWorking,
      addressInPune,
      contributionInterest,
      bloodGroup,
      photoLink: photoUrl, // Cloudinary HTTPS URL
      photoPublicId,
      isEmailVerified: false,
      emailVerificationOTP: hashedOTP,
      emailVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    console.log("[SIGNUP] Step 7: User created successfully. ID:", user._id);

    // STEP 8: Send verification email
    console.log("[SIGNUP] Step 8: Sending verification email to:", user.email);
    try {
      await sendVerificationEmail(user.email, otp);
      console.log("[SIGNUP] Step 8: Verification email sent successfully.");
    } catch (emailError) {
      console.error(
        "[SIGNUP] Step 8: FAILED to send verification email:",
        emailError,
      );
      return NextResponse.json(
        {
          message:
            "Account created successfully. There was an issue sending the verification email. Please use the 'Resend OTP' option.",
          email: user.email,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email for the verification code.",
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    try{
      if(photoPublicId){
        console.log("[SIGNUP] Deleting photo from Cloudinary...");
        await deleteFromCloudinary(photoPublicId);
        console.log("[SIGNUP] Photo deleted successfully.");
      }
    }catch(error){
      console.error("[SIGNUP] ERROR - Failed to delete photo:", error);
    }
    console.error("[SIGNUP] ERROR - Full error:", error);
    console.error(
      "[SIGNUP] ERROR - Name:",
      error instanceof Error ? error.name : "unknown",
    );
    console.error(
      "[SIGNUP] ERROR - Message:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "[SIGNUP] ERROR - Stack:",
      error instanceof Error ? error.stack : "no stack",
    );

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        debug: errorMessage,
      },
      { status: 500 },
    );
  }
}
