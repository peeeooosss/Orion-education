import { clearSessionCookie } from "@/server/auth";

export async function POST() {
  try {
    return clearSessionCookie({ ok: true });
  } catch (error) {
    console.error("Sign-out error:", error);
    return clearSessionCookie({ error: "Internal server error" }, { status: 500 });
  }
}
