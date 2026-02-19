import crypto from 'crypto';

export function generateOtpCode(length = 6) {
  const max = 10 ** length;
  const min = 10 ** (length - 1);
  const code = crypto.randomInt(min, max);
  return String(code);
}

export function hashOtp(code: string) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export function generateTemporaryPassword(length = 12) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += alphabet.charAt(crypto.randomInt(0, alphabet.length));
  }
  return password;
}
