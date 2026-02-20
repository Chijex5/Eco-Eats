function shell(content: string, preheader: string) {
  return `
  <div style="margin:0;padding:0;background:#EEF2F6;font-family:Inter,Arial,sans-serif;color:#102A43;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;background:#EEF2F6;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#FFFFFF;border:1px solid #D9E2EC;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#0B6E4F;padding:28px 32px;color:#FFFFFF;">
                <p style="margin:0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:500;opacity:0.9;">EcoEats</p>
                <p style="margin:8px 0 0;font-size:24px;line-height:1.2;font-weight:700;">Updates from your EcoEats account</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;line-height:1.75;font-size:16px;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;font-size:13px;line-height:1.7;color:#627D98;">
                Need help? Reply to this email and our team will assist you.
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
    .map(
      (line) =>
        `<li style="margin:0 0 12px;padding:0 0 12px;border-bottom:1px solid #E4E7EB;font-size:15px;line-height:1.6;color:#334E68;">${line}</li>`
    )
    .join('');

  return shell(
    `<h2 style="margin:0 0 14px;font-size:30px;line-height:1.2;color:#102A43;">${title}</h2>
     <p style="margin:0 0 24px;font-size:17px;line-height:1.8;color:#334E68;">${intro}</p>
     <div style="margin:0 0 24px;padding:22px 24px;border:1px solid #D9E2EC;border-radius:14px;background:#F8FAFC;">
       <ul style="margin:0;padding:0;list-style:none;">${details}</ul>
     </div>
     ${footer ? `<p style="margin:0;font-size:15px;line-height:1.8;color:#627D98;">${footer}</p>` : ''}`,
    title
  );
}


export function signupOtpTemplate(name: string, otp: string) {
  return {
    subject: 'Verify your EcoEats account',
    html: shell(
      `<p style="margin:0 0 16px;font-size:18px;">Hi ${name},</p>
       <p style="margin:0 0 26px;font-size:17px;color:#334E68;">Welcome to EcoEats. Enter this one-time code to verify your email and complete your signup.</p>
       <div style="margin:0 0 26px;padding:24px 20px;background:#F0FDF4;border:1px solid #0B6E4F;border-radius:14px;text-align:center;">
         <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#486581;">Verification code</p>
         <p style="margin:0;font-size:42px;line-height:1.1;letter-spacing:10px;font-weight:700;color:#0B6E4F;">${otp}</p>
       </div>
       <p style="margin:0 0 10px;font-size:15px;color:#486581;">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
       <p style="margin:0;font-size:15px;color:#627D98;">If you did not create an EcoEats account, you can safely ignore this email.</p>`,
      `Your EcoEats signup verification code is ${otp}`
    ),
  };
}

export function passwordResetOtpTemplate(name: string, otp: string) {
  return {
    subject: 'Your EcoEats password reset code',
    html: shell(
      `<p style="margin:0 0 16px;font-size:18px;">Hi ${name},</p>
       <p style="margin:0 0 26px;font-size:17px;color:#334E68;">Use the code below to reset your EcoEats password.</p>
       <div style="margin:0 0 26px;padding:24px 20px;background:#F0FDF4;border:1px solid #0B6E4F;border-radius:14px;text-align:center;">
         <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#486581;">Password reset code</p>
         <p style="margin:0;font-size:42px;line-height:1.1;letter-spacing:10px;font-weight:700;color:#0B6E4F;">${otp}</p>
       </div>
       <p style="margin:0 0 10px;font-size:15px;color:#486581;">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
       <p style="margin:0;font-size:15px;color:#627D98;">If you did not request this change, you can ignore this message.</p>`,
      `Your EcoEats reset code is ${otp}`
    ),
  };
}

export function adminInviteTemplate(name: string, email: string, tempPassword: string) {
  return {
    subject: 'You have been invited as an EcoEats admin',
    html: shell(
      `<p style="margin:0 0 16px;font-size:18px;">Hi ${name},</p>
       <p style="margin:0 0 24px;font-size:17px;color:#334E68;">An EcoEats account has been created for you with admin access.</p>
       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;border:1px solid #D9E2EC;border-radius:14px;background:#F8FAFC;overflow:hidden;">
         <tr><td style="padding:16px 18px;border-bottom:1px solid #D9E2EC;font-size:15px;"><strong>Email:</strong> ${email}</td></tr>
         <tr><td style="padding:16px 18px;font-size:15px;"><strong>Temporary password:</strong> ${tempPassword}</td></tr>
       </table>
       <p style="margin:0 0 10px;font-size:15px;color:#486581;">Sign in and change your password immediately.</p>
       <p style="margin:0;font-size:15px;color:#627D98;">Login URL: https://ecoeatsng.com/auth/login</p>`,
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
