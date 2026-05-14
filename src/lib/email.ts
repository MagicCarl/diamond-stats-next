import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendPaymentThankYouEmail(to: string, displayName: string | null) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping thank-you email");
    return;
  }

  const greeting = displayName ? `Hi ${displayName},` : "Hi,";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="color: #1f2937; margin-bottom: 16px;">Thank you for your purchase!</h2>
      <p>${greeting}</p>
      <p>Thank you for your purchase of <strong>Baseball Stats Tracker</strong>. You now have full access to all the features.</p>
      <p>You can sign in anytime at <a href="https://www.baseballstatstracker.com" style="color: #2563eb;">baseballstatstracker.com</a> to start tracking your team's stats.</p>
      <p style="margin-top: 24px;">Play ball!</p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">&mdash; Baseball Stats Tracker</p>
    </div>
  `;

  const text = `${greeting}

Thank you for your purchase of Baseball Stats Tracker. You now have full access to all the features.

Sign in anytime at https://www.baseballstatstracker.com to start tracking your team's stats.

Play ball!
— Baseball Stats Tracker`;

  try {
    await resend.emails.send({
      from: `Baseball Stats Tracker <${fromEmail}>`,
      to,
      subject: "Thank you for your purchase of Baseball Stats Tracker",
      html,
      text,
    });
  } catch (err) {
    console.error("Failed to send thank-you email:", err);
  }
}
