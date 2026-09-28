import crypto from "node:crypto";

// Single-user app: a passcode unlocks a signed cookie; the local agent uses a
// separate bearer token that only reaches /api/agent/*.

export const COOKIE = "bikehunt_session";

function hash(s: string): Buffer {
  return crypto.createHash("sha256").update(s).digest();
}

export function safeEqual(a: string, b: string): boolean {
  return crypto.timingSafeEqual(hash(a), hash(b));
}

export function sessionToken(): string | null {
  const pass = process.env.APP_PASSCODE;
  if (!pass) return null;
  return crypto.createHmac("sha256", pass).update("bike-hunt-session-v1").digest("base64url");
}

export function sessionValid(cookie: string | undefined): boolean {
  const expected = sessionToken();
  return !!expected && !!cookie && safeEqual(cookie, expected);
}

export function passcodeValid(given: string): boolean {
  const pass = process.env.APP_PASSCODE;
  return !!pass && safeEqual(given, pass);
}

export function agentValid(header: string | null): boolean {
  const token = process.env.AGENT_TOKEN;
  if (!token || !header) return false;
  return safeEqual(header.replace(/^Bearer\s+/i, ""), token);
}
