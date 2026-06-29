import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "./types";

const SESSION_OPTIONS = {
  password:
    process.env.SESSION_SECRET ??
    "fallback-secret-change-in-production-at-least-32-chars",
  cookieName: "church-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

export async function getSessionUser() {
  const session = await getSession();
  return session.user ?? null;
}
