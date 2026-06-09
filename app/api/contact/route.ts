import { NextRequest } from "next/server";
import { resend, buildInquiryEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, inquiry } = body as {
      name?: string;
      contact?: string;
      inquiry?: string;
    };

    if (!name?.trim() || !contact?.trim() || !inquiry?.trim()) {
      return Response.json(
        { error: "Required fields are missing." },
        { status: 400 }
      );
    }

    const to = process.env.CONTACT_EMAIL;
    if (!to) {
      return Response.json(
        { error: "Recipient address is not configured." },
        { status: 500 }
      );
    }

    const { subject, html, text } = buildInquiryEmail({
      name: name.trim(),
      contact: contact.trim(),
      inquiry: inquiry.trim(),
    });

    const { error } = await resend.emails.send({
      from: "CIELO Maison <onboarding@resend.dev>",
      to: [to],
      replyTo: undefined,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[CIELO contact] Resend error:", error);
      return Response.json(
        { error: "The correspondence could not be delivered." },
        { status: 502 }
      );
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[CIELO contact] Unexpected error:", err);
    return Response.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
