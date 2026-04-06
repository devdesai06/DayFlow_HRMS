import { createMailer, mailFrom } from "../config/mailer.js";
import { ApiError } from "../utils/ApiError.js";

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendEmail({ to, subject, html, text }) {
  const isProd = process.env.NODE_ENV === "production";
  try {
    const transporter = createMailer();
    await transporter.sendMail({
      from: mailFrom(),
      to,
      subject,
      text,
      html,
    });
  } catch (e) {
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify(
          {
            kind: "DEV_EMAIL",
            to,
            subject,
            text,
          },
          null,
          2
        )
      );
      return;
    }
    throw new ApiError(500, "Failed to send email");
  }
}

export function verificationEmailTemplate({ appName, verifyUrl }) {
  const safeAppName = escapeHtml(appName);
  const safeUrl = escapeHtml(verifyUrl);
  return {
    subject: `Verify your ${safeAppName} account`,
    text: `Verify your account: ${verifyUrl}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#F8FAFC;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">
        <div style="padding:24px 24px 0 24px;">
          <div style="font-weight:800;font-size:18px;color:#0F172A;">${safeAppName}</div>
          <div style="margin-top:8px;color:#334155;font-size:14px;line-height:1.6;">
            Confirm your email to activate your account.
          </div>
        </div>
        <div style="padding:24px;">
          <a href="${safeUrl}" style="display:inline-block;background:#6366F1;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:700;">
            Verify email
          </a>
          <div style="margin-top:16px;color:#64748B;font-size:12px;line-height:1.6;">
            If you didn’t request this, you can safely ignore this email.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`,
  };
}

export function otpEmailTemplate({ appName, otp }) {
  const safeAppName = escapeHtml(appName);
  const safeOtp = escapeHtml(otp);
  return {
    subject: `${safeAppName} password reset code`,
    text: `Your password reset code is: ${otp}`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#F8FAFC;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden;">
        <div style="padding:24px 24px 0 24px;">
          <div style="font-weight:800;font-size:18px;color:#0F172A;">${safeAppName}</div>
          <div style="margin-top:8px;color:#334155;font-size:14px;line-height:1.6;">
            Use this 6-digit code to reset your password. It expires in 10 minutes.
          </div>
        </div>
        <div style="padding:24px;">
          <div style="display:inline-block;background:#0F172A;color:#ffffff;padding:12px 16px;border-radius:12px;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:18px;font-weight:800;letter-spacing:2px;">
            ${safeOtp}
          </div>
          <div style="margin-top:16px;color:#64748B;font-size:12px;line-height:1.6;">
            If you didn’t request this, you can safely ignore this email.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`,
  };
}

