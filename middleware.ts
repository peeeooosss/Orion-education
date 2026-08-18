import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "orion-dev-secret-change-in-production");

const AGENT_ROUTES = ["/agent"];
const ADMIN_ROUTES = ["/admin"];

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get("orion-session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  const isAgentRoute = AGENT_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith("/auth");
  const isApiAuth = pathname.startsWith("/api/auth");

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (isAuthRoute && session) {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get("returnTo");
    if (returnTo) {
      const allowed = returnTo.startsWith("/agent/") || returnTo.startsWith("/admin/") || returnTo.startsWith("/student/");
      if (!allowed) return NextResponse.redirect(new URL("/auth/sign-in", request.url));
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
    if (url.pathname === "/auth/sign-in" || url.pathname === "/auth/sign-up") {
      return NextResponse.next();
    }
    if (session.role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (session.role === "agent") return NextResponse.redirect(new URL("/agent/dashboard", request.url));
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (isAgentRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    if (session.role !== "agent" && session.role !== "admin") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    if (session.role !== "admin") {
      if (session.role === "agent") return NextResponse.redirect(new URL("/agent/dashboard", request.url));
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/agent/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/api/auth/:path*",
  ],
};
