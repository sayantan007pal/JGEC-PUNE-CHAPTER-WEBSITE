import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import mongoose from "mongoose";

// GET: Fetch single message and mark as read
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    // Check if user is admin
    const adminUser = await User.findById(auth.userId)
      .select("authRole")
      .lean();
    if (
      !adminUser ||
      (adminUser as { authRole?: string }).authRole !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { messageId } = await params;

    // Validate messageId format
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { error: "Invalid message ID format" },
        { status: 400 }
      );
    }

    // Find the message
    const message = await ContactMessage.findById(messageId)
      .populate("repliedBy", "fullName email")
      .lean();

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Auto-mark as read if currently unread
    if (message.status === "unread") {
      await ContactMessage.findByIdAndUpdate(messageId, { status: "read" });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[ADMIN_CONTACT_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch message." },
      { status: 500 }
    );
  }
}

// PATCH: Update message status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const auth = await getAuthFromCookie();
    if (!auth) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    // Check if user is admin
    const adminUser = await User.findById(auth.userId)
      .select("authRole")
      .lean();
    if (
      !adminUser ||
      (adminUser as { authRole?: string }).authRole !== "admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { messageId } = await params;

    // Validate messageId format
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return NextResponse.json(
        { error: "Invalid message ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["read", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be 'read' or 'resolved'" },
        { status: 400 }
      );
    }

    // Find and update the message
    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    message.status = status;
    await message.save();

    return NextResponse.json({
      message: "Status updated successfully",
      status: message.status,
    });
  } catch (error) {
    console.error("[ADMIN_CONTACT_PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update message status." },
      { status: 500 }
    );
  }
}
