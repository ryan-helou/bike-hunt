import { agentValid } from "@/lib/auth";
import { loadState, saveState } from "@/lib/db";
import { validListing } from "@/lib/listings";
import type { HuntState } from "@/lib/types";

export const dynamic = "force-dynamic";

// The local agent PUTs the whole tracker after every run. Replace, not merge:
// data/tracker.json on Ryan's Mac is the source of truth.
export async function PUT(req: Request) {
  if (!agentValid(req.headers.get("authorization"))) return Response.json({ error: "Not authorized" }, { status: 401 });
  const b = (await req.json().catch(() => null)) as { listings: unknown[]; runs: HuntState["runs"] } | null;
  if (!b || !Array.isArray(b.listings) || !Array.isArray(b.runs)) {
    return Response.json({ error: "Expected { listings, runs }" }, { status: 400 });
  }
  const bad = b.listings.filter((l) => !validListing(l));
  if (bad.length) return Response.json({ error: "Invalid listings", ids: bad.map((l) => (l as { id?: unknown })?.id) }, { status: 400 });
  await saveState({ listings: b.listings as HuntState["listings"], runs: b.runs.slice(-60) });
  return Response.json({ ok: true, listings: b.listings.length });
}

export async function GET(req: Request) {
  if (!agentValid(req.headers.get("authorization"))) return Response.json({ error: "Not authorized" }, { status: 401 });
  return Response.json(await loadState());
}
