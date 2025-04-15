import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // Redirect to dashboard if logged in and trying to access auth pages
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect to sign-in if not logged in and trying to access protected pages
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Allow verify routes regardless of auth state
  if (url.pathname.startsWith('/verify')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*'
  ]
}