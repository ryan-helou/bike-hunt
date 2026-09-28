#!/usr/bin/env node
// The 6am run's bridge to the app.
//   node scripts/agent.mjs sync                  push data/tracker.json to the app
//   node scripts/agent.mjs notify "Title" "Body" push a notification to Ryan's phone
// Reads BIKEHUNT_URL and AGENT_TOKEN from ~/.config/bike-hunt/env.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const env = Object.fromEntries(
  readFileSync(join(homedir(), ".config/bike-hunt/env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const base = env.BIKEHUNT_URL;
const headers = { authorization: `Bearer ${env.AGENT_TOKEN}`, "content-type": "application/json" };

const [cmd, ...args] = process.argv.slice(2);

if (cmd === "sync") {
  const file = join(dirname(fileURLToPath(import.meta.url)), "../data/tracker.json");
  const body = readFileSync(file, "utf8");
  JSON.parse(body); // fail here, not on the server, if the file is broken
  const res = await fetch(`${base}/api/agent/state`, { method: "PUT", headers, body });
  console.log(res.status, await res.text());
  process.exit(res.ok ? 0 : 1);
} else if (cmd === "notify") {
  const [title, body] = args;
  const res = await fetch(`${base}/api/agent/notify`, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, body, tag: "bike-hunt" }),
  });
  console.log(res.status, await res.text());
  process.exit(res.ok ? 0 : 1);
} else {
  console.error('usage: agent.mjs sync | notify "Title" "Body"');
  process.exit(2);
}
