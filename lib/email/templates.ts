const brand = {
  primary: '#0B6E4F',
  primarySoft: '#EAF8F1',
  ink: '#102A43',
  body: '#334E68',
  muted: '#627D98',
  border: '#D9E2EC',
  panel: '#F8FAFC',
  canvas: '#F2F5F8',
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
  <div style="margin:0;padding:0;background:${brand.canvas};font-family:Inter,Segoe UI,Arial,sans-serif;color:${brand.ink};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:44px 16px;background:${brand.canvas};">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#FFFFFF;border:1px solid ${brand.border};border-radius:22px;overflow:hidden;">
            <tr>
              <td style="padding:36px 38px 30px;background:linear-gradient(180deg, #FFFFFF 0%, #FBFDFC 100%);border-bottom:1px solid ${brand.border};">
                <p style="margin:0 0 16px;font-size:12px;line-height:1;letter-spacing:0.12em;text-transform:uppercase;color:${brand.primary};font-weight:700;">${eyebrow}</p>
                <h1 style="margin:0;font-size:34px;line-height:1.2;font-weight:700;color:${brand.ink};">${heading}</h1>
                ${intro ? `<p style="margin:18px 0 0;font-size:17px;line-height:1.9;color:${brand.body};">${intro}</p>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:34px 38px 38px;font-size:16px;line-height:1.8;color:${brand.body};">
                ${body}
              </td>
            </tr>
            ${callout ? `<tr><td style="padding:0 38px 32px;"><div style="padding:16px 18px;border:1px solid ${brand.border};border-radius:12px;background:${brand.panel};font-size:14px;line-height:1.7;color:${brand.muted};">${callout}</div></td></tr>` : ''}
            <tr>
              <td style="padding:0 38px 36px;font-size:13px;line-height:1.8;color:${brand.muted};">
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
        `<tr><td style="padding:${index === 0 ? '0 0 18px' : '18px 0'};font-size:16px;line-height:1.7;color:${brand.body};border-bottom:${index === lines.length - 1 ? 'none' : `1px solid ${brand.border}`};">${line}</td></tr>`
    )
    .join('');
}

function detailsPanel(lines: string[]) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;padding:0 24px;background:${brand.panel};border:1px solid ${brand.border};border-radius:14px;">${detailRows(lines)}</table>`;
}

function noticeTemplate(title: string, intro: string, lines: string[], footer?: string) {
  const body = `
    <p style="margin:0;font-size:17px;line-height:1.9;color:${brand.body};">${intro}</p>
    ${detailsPanel(lines)}
    ${footer ? `<p style="margin:24px 0 0;font-size:16px;line-height:1.8;color:${brand.muted};">${footer}</p>` : ''}
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
    <div style="margin:30px 0;padding:30px 24px;border-radius:16px;border:1px solid ${brand.primary};background:${brand.primarySoft};text-align:center;">
      <p style="margin:0 0 14px;font-size:12px;line-height:1;letter-spacing:0.1em;text-transform:uppercase;color:${brand.muted};font-weight:700;">${label}</p>
      <p style="margin:0;font-size:48px;line-height:1.05;letter-spacing:12px;color:${brand.primary};font-weight:800;">${otp}</p>
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
        <p style="margin:0;font-size:17px;line-height:1.9;color:${brand.body};">Use the code below to verify your email and finish creating your account.</p>
        ${otpBlock('Verification code', otp)}
        <p style="margin:0;font-size:16px;line-height:1.8;color:${brand.body};">This code expires in <strong>10 minutes</strong> and works once.</p>
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
        <p style="margin:0;font-size:17px;line-height:1.9;color:${brand.body};">Enter this code in the app to continue securely.</p>
        ${otpBlock('Password reset code', otp)}
        <p style="margin:0;font-size:16px;line-height:1.8;color:${brand.body};">This code expires in <strong>10 minutes</strong> and works once.</p>
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
        <p style="margin:0;font-size:17px;line-height:1.9;color:${brand.body};">Use the credentials below to sign in and update your password immediately.</p>
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
