import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import User from "@/models/User";
import { getAuthFromCookie } from "@/lib/auth";
import { sendContactReplyToUser } from "@/lib/email";
import mongoose from "mongoose";

export async function POST(
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
      .select("authRole fullName")
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
    const { replyMessage } = body;

    // Validate reply message
    if (!replyMessage?.trim()) {
      return NextResponse.json(
        { error: "Reply message is required" },
        { status: 400 }
      );
    }

    if (replyMessage.trim().length > 5000) {
      return NextResponse.json(
        { error: "Reply message cannot exceed 5000 characters" },
        { status: 400 }
      );
    }

    // Find the message
    const message = await ContactMessage.findById(messageId);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Check if already replied
    if (message.replyMessage) {
      return NextResponse.json(
        { error: "This message has already been replied to" },
        { status: 409 }
      );
    }

    // Update message with reply
    message.replyMessage = replyMessage.trim();
    message.repliedBy = new mongoose.Types.ObjectId(auth.userId);
    message.repliedAt = new Date();
    message.status = "resolved"; // Auto-resolve on reply
    await message.save();

    // Send email to user (non-blocking)
    try {
      await sendContactReplyToUser(message.email, {
        senderName: message.name,
        originalSubject: message.subject,
        originalMessage: message.message,
        replyMessage: replyMessage.trim(),
      });
    } catch (emailError) {
      // Log but don't fail the request
      console.error("[ADMIN_CONTACT_REPLY] Failed to send reply email:", emailError);
    }

    return NextResponse.json({
      message: "Reply sent successfully",
      repliedAt: message.repliedAt,
    });
  } catch (error) {
    console.error("[ADMIN_CONTACT_REPLY] Error:", error);
    return NextResponse.json(
      { error: "Failed to send reply." },
      { status: 500 }
    );
  }
}
