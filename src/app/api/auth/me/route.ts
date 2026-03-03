import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(auth.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          passingYear: user.passingYear,
          department: user.department,
          phoneNumber: user.phoneNumber,
          nickName: user.nickName,
          currentOrLastOrganization: user.currentOrLastOrganization,
          designation: user.designation,
          rolesAndResponsibility: user.rolesAndResponsibility,
          tenureStartDate: user.tenureStartDate,
          tenureEndDate: user.tenureEndDate,
          isCurrentlyWorking: user.isCurrentlyWorking,
          addressInPune: user.addressInPune,
          contributionInterest: user.contributionInterest,
          bloodGroup: user.bloodGroup,
          photoLink: user.photoLink,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
