import { Resend } from "resend";

// Do NOT initialise at module scope — env vars are unavailable at build time
// on Cloudflare Pages. Call createResend() inside each request handler.
export function createResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

export function buildInquiryEmail(data: {
  name: string;
  contact: string;
  inquiry: string;
}): { subject: string; html: string; text: string } {
  const { name, contact, inquiry } = data;
  const received = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `Private Inquiry — ${name}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CIELO — Private Inquiry</title>
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #0A0A0A;
  font-family: Georgia, 'Times New Roman', serif;
  color: #C8C8C8;
">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A;">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom: 40px; border-bottom: 1px solid rgba(184,150,46,0.2);">
              <p style="
                margin: 0;
                font-family: Georgia, serif;
                font-size: 22px;
                letter-spacing: 0.35em;
                color: #B8962E;
                text-transform: uppercase;
              ">CIELO</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 48px 0 40px;">
              <p style="
                margin: 0 0 32px;
                font-size: 11px;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: rgba(184,150,46,0.6);
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-weight: 300;
              ">Private Inquiry — ${received}</p>

              <table cellpadding="0" cellspacing="0" width="100%">

                <tr>
                  <td style="padding-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <p style="
                      margin: 0 0 6px;
                      font-size: 9px;
                      letter-spacing: 0.18em;
                      text-transform: uppercase;
                      color: rgba(200,200,200,0.4);
                      font-family: 'Helvetica Neue', Arial, sans-serif;
                      font-weight: 300;
                    ">From</p>
                    <p style="
                      margin: 0;
                      font-size: 17px;
                      color: #FAFAF8;
                      font-family: Georgia, serif;
                      font-weight: 400;
                      letter-spacing: 0.04em;
                    ">${name}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <p style="
                      margin: 0 0 6px;
                      font-size: 9px;
                      letter-spacing: 0.18em;
                      text-transform: uppercase;
                      color: rgba(200,200,200,0.4);
                      font-family: 'Helvetica Neue', Arial, sans-serif;
                      font-weight: 300;
                    ">Contact Preference</p>
                    <p style="
                      margin: 0;
                      font-size: 15px;
                      color: #C8C8C8;
                      font-family: Georgia, serif;
                      letter-spacing: 0.04em;
                    ">${contact}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding-top: 28px;">
                    <p style="
                      margin: 0 0 10px;
                      font-size: 9px;
                      letter-spacing: 0.18em;
                      text-transform: uppercase;
                      color: rgba(200,200,200,0.4);
                      font-family: 'Helvetica Neue', Arial, sans-serif;
                      font-weight: 300;
                    ">Inquiry</p>
                    <p style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.85;
                      color: #C8C8C8;
                      font-family: Georgia, serif;
                      letter-spacing: 0.02em;
                      white-space: pre-wrap;
                    ">${inquiry.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding-top: 36px;
              border-top: 1px solid rgba(184,150,46,0.15);
            ">
              <p style="
                margin: 0;
                font-size: 9px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: rgba(200,200,200,0.25);
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-weight: 300;
              ">This correspondence is private.<br/>
              CIELO does not share client information with any third party.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `CIELO — Private Inquiry\n${"─".repeat(40)}\n\nFrom: ${name}\nContact: ${contact}\nReceived: ${received}\n\n${inquiry}\n\n${"─".repeat(40)}\nThis correspondence is private.`;

  return { subject, html, text };
}
