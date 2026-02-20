const BRAND = {
  appName: 'Eco-Eats',
  primary: '#2F7A58',
  primaryDark: '#1F5A40',
  text: '#1B2A22',
  mutedText: '#4E5F57',
  border: '#DCE7DF',
  canvas: '#F4F7F5',
  surface: '#FFFFFF',
};

type EmailAction = {
  label: string;
  url: string;
};

type BaseEmailTemplate = {
  preview: string;
  heading: string;
  intro: string;
  body: string;
  action?: EmailAction;
  footerNote?: string;
};

type OtpEmailTemplate = {
  preview: string;
  recipientName?: string;
  otpCode: string;
  expiresInMinutes: number;
  purpose: string;
};

type NotificationTimelineItem = {
  title: string;
  detail: string;
};

type NotificationEmailTemplate = {
  preview: string;
  heading: string;
  intro: string;
  summaryTitle: string;
  summaryBody: string;
  highlights?: string[];
  timeline?: NotificationTimelineItem[];
  action?: EmailAction;
  footerNote?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderLayout(content: BaseEmailTemplate) {
  const action = content.action
    ? `
      <tr>
        <td style="padding: 0 40px 44px 40px;">
          <a href="${escapeHtml(content.action.url)}"
             style="display:inline-block;padding:16px 30px;border-radius:12px;background:${BRAND.primary};color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
            ${escapeHtml(content.action.label)}
          </a>
        </td>
      </tr>`
    : '';

  const footerNote = content.footerNote
    ? `<p style="margin:0;color:${BRAND.mutedText};font-size:14px;line-height:1.7;">${escapeHtml(content.footerNote)}</p>`
    : '';

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(content.heading)} - ${BRAND.appName}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.canvas};font-family:Inter,Arial,sans-serif;color:${BRAND.text};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.canvas};padding:36px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:36px 40px;border-bottom:1px solid ${BRAND.border};">
                <p style="margin:0 0 20px 0;color:${BRAND.primary};font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${BRAND.appName}</p>
                <h1 style="margin:0;color:${BRAND.text};font-size:36px;line-height:1.25;font-weight:700;">${escapeHtml(content.heading)}</h1>
                <p style="margin:22px 0 0 0;color:${BRAND.mutedText};font-size:18px;line-height:1.75;">${escapeHtml(content.intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 28px 40px;color:${BRAND.text};font-size:17px;line-height:1.85;">${content.body}</td>
            </tr>
            ${action}
            <tr>
              <td style="padding:0 40px 38px 40px;">
                <hr style="margin:0 0 22px 0;border:none;border-top:1px solid ${BRAND.border};" />
                ${footerNote}
                <p style="margin:18px 0 0 0;color:${BRAND.mutedText};font-size:13px;line-height:1.7;">You are receiving this transactional email from ${BRAND.appName}. Please do not reply directly to this message.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOtpEmail(data: OtpEmailTemplate) {
  const greeting = data.recipientName ? `Hi ${escapeHtml(data.recipientName)},` : 'Hi there,';

  return renderLayout({
    preview: data.preview,
    heading: `${data.purpose} verification code`,
    intro: 'Use the one-time passcode below to continue securely. For your protection this code expires quickly.',
    body: `
      <p style="margin:0 0 26px 0;">${greeting}</p>
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px 0;width:100%;max-width:320px;border:1px solid ${BRAND.border};border-radius:14px;background:#F9FCFA;">
        <tr>
          <td align="center" style="padding:20px 24px;">
            <p style="margin:0 0 8px 0;color:${BRAND.mutedText};font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">One-time code</p>
            <p style="margin:0;color:${BRAND.primaryDark};font-size:38px;font-weight:700;letter-spacing:0.18em;">${escapeHtml(data.otpCode)}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px 0;">This code is valid for <strong>${data.expiresInMinutes} minutes</strong>. Enter it on the verification screen to complete your request.</p>
      <p style="margin:0;">If you did not request this code, ignore this email and your account will stay secure.</p>
    `,
    footerNote: 'Tip: Never share your one-time code with anyone, including support staff.',
  });
}

export function renderNotificationEmail(data: NotificationEmailTemplate) {
  const highlights = data.highlights?.length
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;margin:0 0 30px 0;">
        <tr>
          <td style="padding:0;">
            <p style="margin:0 0 12px 0;color:${BRAND.text};font-size:20px;font-weight:700;">Key details</p>
            <ul style="margin:0;padding:0 0 0 22px;color:${BRAND.text};font-size:16px;line-height:1.95;">
              ${data.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </td>
        </tr>
      </table>`
    : '';

  const timeline = data.timeline?.length
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;margin:10px 0 0 0;">
        <tr><td style="padding:0 0 12px 0;color:${BRAND.text};font-size:20px;font-weight:700;">Timeline</td></tr>
        ${data.timeline
          .map(
            (item) => `
              <tr>
                <td style="padding:14px 0;border-top:1px solid ${BRAND.border};">
                  <p style="margin:0 0 6px 0;color:${BRAND.text};font-size:16px;font-weight:600;">${escapeHtml(item.title)}</p>
                  <p style="margin:0;color:${BRAND.mutedText};font-size:15px;line-height:1.8;">${escapeHtml(item.detail)}</p>
                </td>
              </tr>`
          )
          .join('')}
      </table>`
    : '';

  return renderLayout({
    preview: data.preview,
    heading: data.heading,
    intro: data.intro,
    body: `
      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;margin:0 0 30px 0;padding:22px 24px;border-radius:14px;background:#F6FAF8;border:1px solid ${BRAND.border};">
        <tr>
          <td>
            <p style="margin:0 0 8px 0;color:${BRAND.text};font-size:22px;font-weight:700;">${escapeHtml(data.summaryTitle)}</p>
            <p style="margin:0;color:${BRAND.mutedText};font-size:16px;line-height:1.9;">${escapeHtml(data.summaryBody)}</p>
          </td>
        </tr>
      </table>
      ${highlights}
      ${timeline}
    `,
    action: data.action,
    footerNote: data.footerNote,
  });
}

export function renderPasswordResetEmail(resetUrl: string) {
  return renderLayout({
    preview: 'Reset your password securely.',
    heading: 'Reset your password',
    intro: 'A password reset was requested for your Eco-Eats account.',
    body: '<p style="margin:0;">Use the button below to set a new password. For security, this link expires soon and can only be used once.</p>',
    action: {
      label: 'Reset password',
      url: resetUrl,
    },
    footerNote: 'If you did not request this change, no action is needed.',
  });
}
