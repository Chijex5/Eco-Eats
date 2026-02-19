export const resendApiKey = process.env.RESEND_API_KEY;

export const emailConfig = {
  authFrom: process.env.EMAIL_AUTH_FROM || 'EcoEats Support <support@ecoeatsng.com>',
  marketingFrom: process.env.EMAIL_MARKETING_FROM || 'Christabel from EcoEats <christabel@ecoeatsng.com>',
};
