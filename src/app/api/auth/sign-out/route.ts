import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/server/auth";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Sign-out error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
