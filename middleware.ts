import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // cek sesi user
  const sessionToken =
    request.cookies.get("better-auth-session_token") ||
    request.cookies.get("__Secure-better-auth-session_token");

  // daftar rute yang di proteksi (authenticated only)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/cms");

  // daftar rute auth (login / register)
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // Logic Middleware

  // Kasus 1 : user belum login, tapi mengakses rute yang di proteksi
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // kasus 2 : user sudah login, tapi mengakses rute auth
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // kasus 3 : sisanya biarkan saja
  return NextResponse.next();
}

// Konfigurasi matcher : nentuin rute mana aja yang di cek middleware ini
export const config = {
  matcher: [
    // skip next.js internal rute and all static files
    "/((?!_next|[^?]*//.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
