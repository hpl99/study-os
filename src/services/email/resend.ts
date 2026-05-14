import { Resend } from "resend";

// Initialize Resend client only if API key is present
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Base sender address
const SENDER_EMAIL = "StudyOS Notifications <notifications@studyos.com>"; // Replace with verified domain

/**
 * Sends a generic notification email
 */
export async function sendNotificationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn("Resend is not configured. Skipping email:", subject);
    return { success: false, error: "Resend not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, error: err };
  }
}

/**
 * Sends a contest reminder email
 */
export async function sendContestReminder(to: string, contestName: string, startTime: string, platform: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Contest Reminder: ${contestName}</h2>
      <p style="color: #555;">Hi there,</p>
      <p style="color: #555;">This is a reminder that an upcoming contest on <strong>${platform}</strong> is starting soon.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Contest:</strong> ${contestName}</p>
        <p style="margin: 5px 0 0 0;"><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
      </div>
      <p style="color: #555;">Good luck with your contest!</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        You are receiving this because you enabled contest reminders in StudyOS.
      </p>
    </div>
  `;

  return sendNotificationEmail({
    to,
    subject: `Reminder: ${contestName} starts soon!`,
    html,
  });
}

/**
 * Sends a study streak or revision reminder
 */
export async function sendRevisionReminder(to: string, topicsCount: number) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">StudyOS Revision Reminder</h2>
      <p style="color: #555;">Hi there,</p>
      <p style="color: #555;">You have <strong>${topicsCount}</strong> topics scheduled for revision today.</p>
      <p style="color: #555;">Consistent spaced repetition is key to long-term retention. Take 15 minutes today to review your notes and keep your streak alive!</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/notes" style="display: inline-block; background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
        Review Notes Now
      </a>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        You are receiving this because you have topics due for revision in StudyOS.
      </p>
    </div>
  `;

  return sendNotificationEmail({
    to,
    subject: "📚 Topics due for revision today!",
    html,
  });
}
