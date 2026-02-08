import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { NavigationClient, publicLinks, roleLinks } from './Navigation';

async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function Navigation() {
  const session = await getSession();
  const navLinks = session ? roleLinks[session.role] ?? publicLinks : publicLinks;
  const initials = session?.name
    ? session.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'EE';

  return <NavigationClient session={session} navLinks={navLinks} initials={initials} />;
}
