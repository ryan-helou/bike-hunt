import { COOKIE, passcodeValid, sessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const form = await req.formData();
  const code = String(form.get("passcode") ?? "");
  if (!passcodeValid(code)) return Response.redirect(new URL("/login?wrong=1", req.url), 303);
  const res = Response.redirect(new URL("/", req.url), 303);
  const headers = new Headers(res.headers);
  headers.append(
    "Set-Cookie",
    `${COOKIE}=${sessionToken()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`,
  );
  return new Response(null, { status: 303, headers });
}
