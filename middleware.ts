import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { verifySessionToken } from '@/lib/auth/jwt';
import { getRequiredRoles, isRoleAllowed } from '@/lib/auth/rbac';

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/setup')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return handleUnauthenticated(request);
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return handleUnauthenticated(request);
  }

  if (!isRoleAllowed(session.role, requiredRoles)) {
    return handleForbidden(request);
  }

  return NextResponse.next();
}

function handleUnauthenticated(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL('/auth/login', request.url);
  url.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function handleForbidden(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const url = new URL('/auth/login', request.url);
  url.searchParams.set('error', 'forbidden');
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/app/:path*', '/donor/:path*', '/partner/:path*', '/admin/:path*', '/api/:path*'],
};
