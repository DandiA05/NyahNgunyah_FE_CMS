import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/produk', req.url));
  }

  const token = req.cookies.get('token')?.value;
  const isLogin = !!token;



  if (!isLogin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/pegawai/:path*', '/cuti/:path*'],
};
