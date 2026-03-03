import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user with password field included
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: "Please verify your email before logging in.",
          needsVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response with user data (without password)
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      passingYear: user.passingYear,
      department: user.department,
      phoneNumber: user.phoneNumber,
      nickName: user.nickName,
      currentOrLastOrganization: user.currentOrLastOrganization,
      designation: user.designation,
      bloodGroup: user.bloodGroup,
      photoLink: user.photoLink,
    };

    const response = NextResponse.json(
      { message: "Login successful", user: userData },
      { status: 200 }
    );

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
