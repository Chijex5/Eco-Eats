import { emailConfig, resendApiKey } from './client';
import {
  adminInviteTemplate,
  donationReceiptTemplate,
  newSurplusBroadcastTemplate,
  passwordResetOtpTemplate,
  signupOtpTemplate,
  supportRequestDecisionTemplate,
  surplusClaimedTemplate,
  surplusPickedUpTemplate,
  voucherIssuedTemplate,
  voucherRedeemedTemplate,
} from './templates';

async function sendEmail({ to, from, subject, html }: { to: string; from: string; subject: string; html: string }) {
  if (!resendApiKey) {
    console.warn(`RESEND_API_KEY missing. Skipping email to ${to}.`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, from, subject, html }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${payload}`);
  }
}

async function sendSafe(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (error) {
    console.error('Email send error:', error);
  }
}


export async function sendSignupOtpEmail(to: string, name: string, otp: string) {
  const template = signupOtpTemplate(name, otp);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendPasswordResetOtpEmail(to: string, name: string, otp: string) {
  const template = passwordResetOtpTemplate(name, otp);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendAdminInviteEmail(to: string, name: string, tempPassword: string) {
  const template = adminInviteTemplate(name, to, tempPassword);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendVoucherIssuedEmail(to: string, name: string, amountNgn: string, code: string, expires: string) {
  const template = voucherIssuedTemplate(name, amountNgn, code, expires);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendSupportRequestDecisionEmail(
  to: string,
  name: string,
  status: 'APPROVED' | 'DECLINED',
  requestType: string
) {
  const template = supportRequestDecisionTemplate(name, status, requestType);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendSurplusBroadcastEmail(
  to: string,
  partnerName: string,
  title: string,
  quantity: number,
  pickupDeadline: string
) {
  const template = newSurplusBroadcastTemplate(partnerName, title, quantity, pickupDeadline);
  await sendSafe(() => sendEmail({ to, from: emailConfig.marketingFrom, subject: template.subject, html: template.html }));
}

export async function sendSurplusClaimedEmail(to: string, name: string, title: string, pickupCode: string) {
  const template = surplusClaimedTemplate(name, title, pickupCode);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendSurplusPickedUpEmail(to: string, name: string, pickupCode: string) {
  const template = surplusPickedUpTemplate(name, pickupCode);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendVoucherRedeemedEmail(to: string, name: string, code: string) {
  const template = voucherRedeemedTemplate(name, code);
  await sendSafe(() => sendEmail({ to, from: emailConfig.authFrom, subject: template.subject, html: template.html }));
}

export async function sendDonationReceiptEmail(to: string, name: string, amountNgn: string, donationType: string) {
  const template = donationReceiptTemplate(name, amountNgn, donationType);
  await sendSafe(() => sendEmail({ to, from: emailConfig.marketingFrom, subject: template.subject, html: template.html }));
}
