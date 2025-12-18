import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, htmlContent, title }) {
  try {
    if (!to || !subject || !htmlContent) {
      throw new Error("Missing required email parameters");
    }

    const response = await resend.emails.send({
      from: `${title} <onboarding@resend.dev>`,
      to,
      subject,
      html: htmlContent,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return false;
  }
}
