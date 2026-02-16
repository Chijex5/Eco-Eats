import { SignJWT, jwtVerify } from 'jose';
import { SESSION_MAX_AGE_SECONDS } from './constants';
import type { UserRole } from './roles';

export type SessionPayload = {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
  mustChangePassword?: boolean;
};

const encoder = new TextEncoder();

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET not configured');
  }
  return secret;
}

function getSecretKey() {
  return encoder.encode(getAuthSecret());
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
