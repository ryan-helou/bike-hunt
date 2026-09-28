import { Pool } from "pg";
import type { HuntState } from "./types";

// Two tables: one JSON row holding the whole hunt state (the agent syncs it
// whole), and the push subscriptions.

let pool: Pool | null = null;
let ready: Promise<void> | null = null;

function db(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    pool = new Pool({ connectionString: url, max: 3 });
  }
  if (!ready) {
    ready = pool
      .query(
        `CREATE TABLE IF NOT EXISTS state (id int PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
         CREATE TABLE IF NOT EXISTS push_subs (endpoint text PRIMARY KEY, keys jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());`,
      )
      .then(() => undefined);
  }
  return pool;
}

async function q<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  const p = db();
  await ready;
  return (await p.query(sql, params)).rows as T[];
}

export async function loadState(): Promise<HuntState> {
  const rows = await q<{ data: HuntState }>("SELECT data FROM state WHERE id = 1");
  return rows[0]?.data ?? { listings: [], runs: [] };
}

export async function saveState(state: HuntState): Promise<void> {
  await q(
    "INSERT INTO state (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now()",
    [JSON.stringify(state)],
  );
}

export interface Sub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function allSubs(): Promise<Sub[]> {
  return q<Sub>("SELECT endpoint, keys FROM push_subs");
}

export async function saveSub(s: Sub): Promise<void> {
  await q(
    "INSERT INTO push_subs (endpoint, keys) VALUES ($1, $2) ON CONFLICT (endpoint) DO UPDATE SET keys = $2",
    [s.endpoint, JSON.stringify(s.keys)],
  );
}

export async function removeSub(endpoint: string): Promise<void> {
  await q("DELETE FROM push_subs WHERE endpoint = $1", [endpoint]);
}
