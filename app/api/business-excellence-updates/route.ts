import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullName, companyName, email, phone, message } = body;

    let emailStatus = "Email notification skipped";

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
          from: "MBN Consulting <onboarding@resend.dev>",
          to: ["mahtab@mbncon.com"],
          subject: "New Business Excellence Updates Submission",
          html: `
            <h2>New Business Excellence Updates Signup</h2>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Message:</strong> ${message || "Not provided"}</p>
          `,
        });

        if (error) {
          console.error("Resend error:", error);
          emailStatus = "Submission saved, but email notification failed";
        } else {
          console.log("Resend success:", data);
          emailStatus = "Email notification sent";
        }
      } catch (emailError) {
        console.error("Resend send failed:", emailError);
        emailStatus = "Submission saved, but email notification failed";
      }
    } else {
      console.error("Missing RESEND_API_KEY");
    }

    return NextResponse.json({
      success: true,
      message:
        "Submission successful. Thank you — you can now enjoy updates on AI in Business Excellence, Operations, Lean, Kaizen, TQM, and Manufacturing Intelligence.",
      emailStatus,
    });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}