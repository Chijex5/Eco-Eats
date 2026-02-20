const palette = {
  background: '#F5F7FA',
  foreground: '#0F172A',
  primary: '#0B6E4F',
};

type ShellOptions = {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  body: string;
  callout?: string;
};

function shell({ preheader, eyebrow, heading, intro, body, callout }: ShellOptions) {
  return `
  <div style="margin:0;padding:0;background:${palette.background};font-family:Inter,Segoe UI,Arial,sans-serif;color:${palette.foreground};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:48px 16px;background:${palette.background};">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:${palette.background};">
            <tr>
              <td style="padding:0 10px 30px;">
                <p style="margin:0 0 14px;font-size:12px;line-height:1;letter-spacing:0.12em;text-transform:uppercase;color:${palette.foreground};font-weight:600;opacity:0.7;">${eyebrow}</p>
                <h1 style="margin:0;font-size:36px;line-height:1.2;font-weight:700;color:${palette.foreground};">${heading}</h1>
                ${intro ? `<p style="margin:18px 0 0;font-size:18px;line-height:1.9;color:${palette.foreground};opacity:0.86;">${intro}</p>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:0 10px;font-size:17px;line-height:1.95;color:${palette.foreground};opacity:0.9;">
                ${body}
              </td>
            </tr>
            ${callout ? `<tr><td style="padding:28px 10px 0;"><p style="margin:0;padding-left:14px;border-left:3px solid ${palette.primary};font-size:15px;line-height:1.8;color:${palette.foreground};opacity:0.78;">${callout}</p></td></tr>` : ''}
            <tr>
              <td style="padding:34px 10px 0;font-size:13px;line-height:1.8;color:${palette.foreground};opacity:0.6;">
                You are receiving this email because of activity on your EcoEats account.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function detailRows(lines: string[]) {
  return lines
    .map(
      (line, index) =>
        `<tr><td style="padding:${index === 0 ? '0 0 18px' : '18px 0'};font-size:16px;line-height:1.8;color:${palette.foreground};opacity:0.88;border-bottom:${index === lines.length - 1 ? 'none' : `1px solid ${palette.foreground}22`};">${line}</td></tr>`
    )
    .join('');
}

function detailsPanel(lines: string[]) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0;padding:0 22px;background:transparent;border-top:1px solid ${palette.foreground}2E;border-bottom:1px solid ${palette.foreground}2E;">${detailRows(lines)}</table>`;
}

function noticeTemplate(title: string, intro: string, lines: string[], footer?: string) {
  const body = `
    <p style="margin:0;font-size:17px;line-height:1.95;color:${palette.foreground};opacity:0.88;">${intro}</p>
    ${detailsPanel(lines)}
    ${footer ? `<p style="margin:26px 0 0;font-size:16px;line-height:1.85;color:${palette.foreground};opacity:0.72;">${footer}</p>` : ''}
  `;

  return shell({
    preheader: title,
    eyebrow: 'EcoEats notification',
    heading: title,
    body,
  });
}

function otpBlock(label: string, otp: string) {
  return `
    <div style="margin:34px 0;padding:34px 20px;border:1px solid ${palette.primary};text-align:center;">
      <p style="margin:0 0 14px;font-size:12px;line-height:1;letter-spacing:0.1em;text-transform:uppercase;color:${palette.foreground};opacity:0.65;font-weight:700;">${label}</p>
      <p style="margin:0;font-size:52px;line-height:1.05;letter-spacing:12px;color:${palette.primary};font-weight:800;">${otp}</p>
    </div>
  `;
}

export function signupOtpTemplate(name: string, otp: string) {
  return {
    subject: 'Verify your EcoEats account',
    html: shell({
      preheader: `Your EcoEats signup verification code is ${otp}`,
      eyebrow: 'Account verification',
      heading: 'Confirm your email address',
      intro: `Hi ${name}, welcome to EcoEats.`,
      body: `
        <p style="margin:0;font-size:17px;line-height:1.95;color:${palette.foreground};opacity:0.88;">Use the code below to verify your email and finish creating your account.</p>
        ${otpBlock('Verification code', otp)}
        <p style="margin:0;font-size:16px;line-height:1.85;color:${palette.foreground};opacity:0.82;">This code expires in <strong>10 minutes</strong> and works once.</p>
      `,
      callout: 'If you did not create an EcoEats account, you can ignore this message.',
    }),
  };
}

export function passwordResetOtpTemplate(name: string, otp: string) {
  return {
    subject: 'Your EcoEats password reset code',
    html: shell({
      preheader: `Your EcoEats reset code is ${otp}`,
      eyebrow: 'Password security',
      heading: 'Reset your password',
      intro: `Hi ${name}, we received a request to reset your EcoEats password.`,
      body: `
        <p style="margin:0;font-size:17px;line-height:1.95;color:${palette.foreground};opacity:0.88;">Enter this code in the app to continue securely.</p>
        ${otpBlock('Password reset code', otp)}
        <p style="margin:0;font-size:16px;line-height:1.85;color:${palette.foreground};opacity:0.82;">This code expires in <strong>10 minutes</strong> and works once.</p>
      `,
      callout: 'If you did not request a password reset, please ignore this email. Your account is still secure.',
    }),
  };
}

export function adminInviteTemplate(name: string, email: string, tempPassword: string) {
  return {
    subject: 'You have been invited as an EcoEats admin',
    html: shell({
      preheader: 'Your EcoEats admin invitation details',
      eyebrow: 'Admin invitation',
      heading: 'Your admin access is ready',
      intro: `Hi ${name}, an EcoEats admin account has been created for you.`,
      body: `
        <p style="margin:0;font-size:17px;line-height:1.95;color:${palette.foreground};opacity:0.88;">Use the credentials below to sign in and update your password immediately.</p>
        ${detailsPanel([`<strong>Email:</strong> ${email}`, `<strong>Temporary password:</strong> ${tempPassword}`, '<strong>Login:</strong> https://ecoeatsng.com/auth/login'])}
      `,
      callout: 'For security, share these details only through approved internal channels.',
    }),
  };
}

export function voucherIssuedTemplate(name: string, amountNgn: string, code: string, expires: string) {
  return {
    subject: 'Your EcoEats voucher has been approved',
    html: noticeTemplate(
      `Hi ${name}, your voucher is ready`,
      'Your support request was approved and a voucher has now been issued to your account.',
      [`Voucher code: <strong>${code}</strong>`, `Voucher value: <strong>₦${amountNgn}</strong>`, `Expires: <strong>${expires}</strong>`],
      'Open your EcoEats dashboard to redeem your voucher.'
    ),
  };
}

export function supportRequestDecisionTemplate(name: string, status: 'APPROVED' | 'DECLINED', requestType: string) {
  const approved = status === 'APPROVED';
  return {
    subject: approved ? 'Your EcoEats request was approved' : 'Update on your EcoEats request',
    html: noticeTemplate(
      `Hi ${name}, your ${requestType.toLowerCase()} request is ${approved ? 'approved' : 'declined'}`,
      approved
        ? 'Your request has been reviewed and approved by the EcoEats team.'
        : 'Your request has been reviewed and was not approved this time.',
      [approved ? 'You can now continue from your dashboard.' : 'You can submit another request after updating your details.']
    ),
  };
}

export function newSurplusBroadcastTemplate(partnerName: string, title: string, quantity: number, pickupDeadline: string) {
  return {
    subject: 'New food pack surplus is now available',
    html: noticeTemplate(
      'New surplus posted for beneficiaries',
      `${partnerName} posted a new surplus listing. Claim quickly while stock is available.`,
      [`Listing: <strong>${title}</strong>`, `Quantity available: <strong>${quantity}</strong>`, `Pickup deadline: <strong>${pickupDeadline}</strong>`],
      'Open your beneficiary dashboard now to claim this listing.'
    ),
  };
}

export function surplusClaimedTemplate(name: string, title: string, pickupCode: string) {
  return {
    subject: 'Your food pack claim is confirmed',
    html: noticeTemplate(
      `Hi ${name}, your claim is confirmed`,
      'Your food pack claim has been recorded successfully.',
      [`Listing: <strong>${title}</strong>`, `Pickup code: <strong>${pickupCode}</strong>`],
      'Present your pickup code to partner staff during collection.'
    ),
  };
}

export function surplusPickedUpTemplate(name: string, pickupCode: string) {
  return {
    subject: 'Food pack pickup completed',
    html: noticeTemplate(
      `Hi ${name}, pickup completed`,
      'Your surplus pickup has been confirmed by partner staff.',
      [`Pickup code used: <strong>${pickupCode}</strong>`]
    ),
  };
}

export function voucherRedeemedTemplate(name: string, code: string) {
  return {
    subject: 'Your voucher has been redeemed',
    html: noticeTemplate(
      `Hi ${name}, voucher redeemed`,
      'Your voucher redemption was completed successfully.',
      [`Voucher code: <strong>${code}</strong>`]
    ),
  };
}

export function donationReceiptTemplate(name: string, amountNgn: string, donationType: string) {
  return {
    subject: 'Thank you for supporting EcoEats',
    html: noticeTemplate(
      `Thank you, ${name}`,
      'Your donation has been received successfully. Your support helps us extend food access across communities.',
      [`Amount received: <strong>₦${amountNgn}</strong>`, `Category: <strong>${donationType}</strong>`]
    ),
  };
}
