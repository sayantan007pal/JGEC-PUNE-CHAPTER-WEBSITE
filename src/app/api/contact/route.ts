import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import User from "@/models/User";
import { sendContactNotificationToAdmins } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Connect to database
    await dbConnect();

    // STEP 2: Parse JSON body
    const body = await request.json();
    const {
      name,
      email,
      phone,
      batch,
      subject,
      message,
      website, // Honeypot field
    } = body;

    // STEP 3: Check honeypot field (spam protection)
    // If filled, it's likely a bot - silently accept but don't save
    if (website && website.trim() !== "") {
      console.log("[CONTACT] Honeypot triggered - likely spam submission");
      // Return success to not reveal the honeypot to bots
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200 }
      );
    }

    // STEP 4: Validate required fields
    const missingFields: string[] = [];
    if (!name?.trim()) missingFields.push("name");
    if (!email?.trim()) missingFields.push("email");
    if (!subject?.trim()) missingFields.push("subject");
    if (!message?.trim()) missingFields.push("message");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // STEP 5: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // STEP 6: Validate message length
    if (message.trim().length > 5000) {
      return NextResponse.json(
        { error: "Message cannot exceed 5000 characters" },
        { status: 400 }
      );
    }

    // STEP 7: Create contact message
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      batch: batch?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: "unread",
    });

    // STEP 8: Send notification to admins (non-blocking)
    // If email fails, we still save the message
    try {
      const admins = await User.find(
        { authRole: "admin", isEmailVerified: true },
        { email: 1 }
      ).lean();

      const adminEmails = admins.map((admin) => admin.email);

      if (adminEmails.length > 0) {
        await sendContactNotificationToAdmins(adminEmails, {
          senderName: contactMessage.name,
          senderEmail: contactMessage.email,
          senderPhone: contactMessage.phone,
          senderBatch: contactMessage.batch,
          subject: contactMessage.subject,
          message: contactMessage.message,
          messageId: contactMessage._id.toString(),
        });
      }
    } catch (emailError) {
      // Log but don't fail the request
      console.error("[CONTACT] Failed to send admin notification email:", emailError);
    }

    return NextResponse.json(
      { 
        message: "Message sent successfully",
        messageId: contactMessage._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CONTACT] Error:", error);
    
    // Check for validation errors from Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
