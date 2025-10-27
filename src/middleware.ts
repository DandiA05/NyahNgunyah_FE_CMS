import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // 🚫 Jangan proteksi halaman login
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // 🏠 Redirect root ke /produk
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/produk', req.url));
  }

  // 🔒 Kalau tidak punya token, paksa ke /auth/signin
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // ✅ Kalau punya token, lanjut
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
