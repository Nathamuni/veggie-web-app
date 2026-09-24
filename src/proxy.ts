import { NextResponse, type NextRequest } from 'next/server'

/**
 * Optimistic auth routing only — it checks the session cookie exists, never
 * the database. Real verification happens in `requireUser()` next to the data.
 */
const SESSION_COOKIE = 'veggie_session'

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value)

  if (!hasSession && (pathname.startsWith('/app') || pathname.startsWith('/onboarding'))) {
    const url = new URL('/auth/sign-in', req.nextUrl)
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }
  if (hasSession && (pathname === '/auth/sign-in' || pathname === '/auth/sign-up')) {
    return NextResponse.redirect(new URL('/app', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/onboarding/:path*', '/onboarding', '/auth/sign-in', '/auth/sign-up'],
}
