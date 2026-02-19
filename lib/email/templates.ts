function shell(content: string, preheader: string) {
  return `
  <div style="margin:0;padding:0;background:#F6F8FB;font-family:Inter,Arial,sans-serif;color:#102A43;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 0;background:#F6F8FB;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;border:1px solid #D9E2EC;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#0B6E4F;padding:20px 24px;color:#FFFFFF;font-size:18px;font-weight:700;">EcoEats</td>
            </tr>
            <tr>
              <td style="padding:24px;line-height:1.6;font-size:15px;">
                ${content}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function noticeTemplate(title: string, intro: string, lines: string[], footer?: string) {
  const details = lines
    .map((line) => `<li style="margin:0 0 8px;">${line}</li>`)
    .join('');

  return shell(
    `<h2 style="margin:0 0 10px;font-size:20px;line-height:1.3;color:#102A43;">${title}</h2>
     <p style="margin:0 0 14px;">${intro}</p>
     <ul style="margin:0 0 14px 18px;padding:0;">${details}</ul>
     ${footer ? `<p style="margin:0;color:#627D98;">${footer}</p>` : ''}`,
    title
  );
}


export function signupOtpTemplate(name: string, otp: string) {
  return {
    subject: 'Verify your EcoEats account',
    html: shell(
      `<p style="margin:0 0 12px;">Hi ${name},</p>
       <p style="margin:0 0 16px;">Welcome to EcoEats. Use this one-time code to verify your email and complete signup.</p>
       <div style="margin:0 0 16px;padding:14px 16px;background:#F0FDF4;border:1px solid #0B6E4F;border-radius:10px;font-size:28px;letter-spacing:6px;font-weight:700;text-align:center;color:#0B6E4F;">${otp}</div>
       <p style="margin:0 0 10px;">This code expires in 10 minutes and can be used once.</p>
       <p style="margin:0;color:#627D98;">If you did not create this account, you can ignore this email.</p>`,
      `Your EcoEats signup verification code is ${otp}`
    ),
  };
}

export function passwordResetOtpTemplate(name: string, otp: string) {
  return {
    subject: 'Your EcoEats password reset code',
    html: shell(
      `<p style="margin:0 0 12px;">Hi ${name},</p>
       <p style="margin:0 0 16px;">Use the code below to reset your EcoEats password.</p>
       <div style="margin:0 0 16px;padding:14px 16px;background:#F0FDF4;border:1px solid #0B6E4F;border-radius:10px;font-size:28px;letter-spacing:6px;font-weight:700;text-align:center;color:#0B6E4F;">${otp}</div>
       <p style="margin:0 0 10px;">This code expires in 10 minutes and can be used once.</p>
       <p style="margin:0;color:#627D98;">If you did not request this change, you can ignore this message.</p>`,
      `Your EcoEats reset code is ${otp}`
    ),
  };
}

export function adminInviteTemplate(name: string, email: string, tempPassword: string) {
  return {
    subject: 'You have been invited as an EcoEats admin',
    html: shell(
      `<p style="margin:0 0 12px;">Hi ${name},</p>
       <p style="margin:0 0 16px;">An EcoEats account has been created for you with admin access.</p>
       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 16px;border:1px solid #D9E2EC;border-radius:10px;">
         <tr><td style="padding:12px 14px;border-bottom:1px solid #D9E2EC;"><strong>Email:</strong> ${email}</td></tr>
         <tr><td style="padding:12px 14px;"><strong>Temporary password:</strong> ${tempPassword}</td></tr>
       </table>
       <p style="margin:0 0 10px;">Sign in and change your password immediately.</p>
       <p style="margin:0;color:#627D98;">Login URL: https://ecoeatsng.com/auth/login</p>`,
      'Your EcoEats admin invitation details'
    ),
  };
}

export function voucherIssuedTemplate(name: string, amountNgn: string, code: string, expires: string) {
  return {
    subject: 'Your EcoEats voucher has been approved',
    html: noticeTemplate(
      `Hi ${name}, your voucher is ready`,
      'Your support request was approved and a voucher was issued to your account.',
      [`Voucher code: ${code}`, `Value: ₦${amountNgn}`, `Expires: ${expires}`],
      'You can use this voucher in the EcoEats app.'
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
        ? 'Your request has been reviewed and approved.'
        : 'Your request has been reviewed and was not approved this time.',
      [approved ? 'You can now continue from your dashboard.' : 'You may submit another request with updated details.']
    ),
  };
}

export function newSurplusBroadcastTemplate(partnerName: string, title: string, quantity: number, pickupDeadline: string) {
  return {
    subject: 'New food pack surplus is now available',
    html: noticeTemplate(
      'New surplus posted for beneficiaries',
      `${partnerName} just posted a new surplus listing.`,
      [`Listing: ${title}`, `Quantity: ${quantity}`, `Pickup deadline: ${pickupDeadline}`],
      'Open your EcoEats beneficiary dashboard to claim quickly.'
    ),
  };
}

export function surplusClaimedTemplate(name: string, title: string, pickupCode: string) {
  return {
    subject: 'Your food pack claim is confirmed',
    html: noticeTemplate(
      `Hi ${name}, your claim is saved`,
      'Your surplus food pack claim has been recorded.',
      [`Listing: ${title}`, `Pickup code: ${pickupCode}`],
      'Show this code to partner staff during pickup.'
    ),
  };
}

export function surplusPickedUpTemplate(name: string, pickupCode: string) {
  return {
    subject: 'Food pack pickup completed',
    html: noticeTemplate(
      `Hi ${name}, pickup completed`,
      'Your surplus pickup was confirmed by partner staff.',
      [`Pickup code: ${pickupCode}`]
    ),
  };
}

export function voucherRedeemedTemplate(name: string, code: string) {
  return {
    subject: 'Your voucher has been redeemed',
    html: noticeTemplate(`Hi ${name}, voucher redeemed`, 'Your voucher redemption was successful.', [`Voucher code: ${code}`]),
  };
}

export function donationReceiptTemplate(name: string, amountNgn: string, donationType: string) {
  return {
    subject: 'Thank you for supporting EcoEats',
    html: noticeTemplate(
      `Thank you, ${name}`,
      'Your donation was received successfully.',
      [`Amount: ₦${amountNgn}`, `Category: ${donationType}`],
      'Your support helps us fund meals, vouchers, and food packs.'
    ),
  };
}
