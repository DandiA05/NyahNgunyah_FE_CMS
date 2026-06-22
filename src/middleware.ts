import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const isLogin = !!token;

  if (pathname === "/") {
    if (!isLogin) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.redirect(new URL("/produk", req.url));
  }

  if (!isLogin) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/pegawai/:path*",
    "/cuti/:path*",
    "/produk/:path*",
    "/transaksi/:path*",
    "/data-admin/:path*",
    "/calendar/:path*",
    "/chart/:path*",
    "/forms/:path*",
    "/settings/:path*",
    "/tables/:path*",
    "/ui/:path*",
    "/profile/:path*",
  ],
};
