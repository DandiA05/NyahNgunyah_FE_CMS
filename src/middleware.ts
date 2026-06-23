import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/produk', req.url));
  }

  // Cek token dari cookie 'access_token' (utama) atau 'token' (fallback)
  const token = req.cookies.get('access_token')?.value || req.cookies.get('token')?.value;
  const isLogin = !!token;

  if (!isLogin) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/data-admin/:path*',
    '/produk/:path*',
    '/transaksi/:path*'
  ],
};

