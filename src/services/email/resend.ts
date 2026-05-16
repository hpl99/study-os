import { Resend } from "resend";
import { Contest } from "@/services/contests";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendContestNotificationEmail(email: string, contests: Contest[]) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  if (contests.length === 0) return { success: true };

  const htmlContent = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Upcoming Contests Reminder</h2>
      <p>Here are your upcoming contests for the next 24 hours:</p>
      <ul style="list-style-type: none; padding: 0;">
        ${contests.map(c => `
          <li style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background-color: #f4f4f5;">
            <strong>${c.name}</strong> (${c.platform})<br/>
            Starts: ${new Date(c.startTimeSeconds * 1000).toLocaleString()}<br/>
            <a href="${c.url}" style="color: #2563eb; text-decoration: none;">View Contest</a>
          </li>
        `).join('')}
      </ul>
      <p style="font-size: 12px; color: #666; margin-top: 24px;">
        You can manage these notifications in your StudyOS dashboard settings.
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "StudyOS <onboarding@resend.dev>", // default testing domain
      to: [email],
      subject: `🏆 ${contests.length} Upcoming Contests`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, error: "Internal error sending email" };
  }
}
