import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "orion-session";
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "orion-dev-secret-change-in-production");

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Sets the session cookie directly on the returned response so the
// Set-Cookie header is guaranteed to reach the browser.
export function setSessionCookie(token: string, data?: unknown, init?: ResponseInit): NextResponse {
  const response = init ? NextResponse.json(data ?? {}, init) : NextResponse.json(data ?? {});
  response.cookies.set(SESSION_COOKIE, token, {
    ...baseCookieOptions(),
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return response;
}

// Clears the session cookie directly on the returned response.
export function clearSessionCookie(data?: unknown, init?: ResponseInit): NextResponse {
  const response = init ? NextResponse.json(data ?? {}, init) : NextResponse.json(data ?? {});
  response.cookies.set(SESSION_COOKIE, "", {
    ...baseCookieOptions(),
    maxAge: 0,
  });
  return response;
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}
