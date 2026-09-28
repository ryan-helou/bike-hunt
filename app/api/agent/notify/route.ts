import { agentValid } from "@/lib/auth";
import { sendPush } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!agentValid(req.headers.get("authorization"))) return Response.json({ error: "Not authorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { title?: unknown; body?: unknown; tag?: unknown };
  const title = typeof b.title === "string" ? b.title.trim().slice(0, 120) : "";
  if (!title) return Response.json({ error: "A title is required" }, { status: 400 });
  const body = typeof b.body === "string" ? b.body.slice(0, 240) : undefined;
  const tag = typeof b.tag === "string" ? b.tag.slice(0, 60) : undefined;
  return Response.json({ ok: true, ...(await sendPush({ title, body, tag })) });
}
