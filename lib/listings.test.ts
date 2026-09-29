import assert from "node:assert/strict";
import { groupListings, margin, runIsStale, validListing } from "./listings";
import type { Listing } from "./types";

const base: Listing = {
  id: "123",
  url: "https://www.facebook.com/marketplace/item/123/",
  title: "Cervelo P2 54",
  location: "Ottawa",
  asking: 900,
  status: "watching",
  verdict: "fits",
  firstSeenISO: "2026-09-27T10:00:00Z",
  updatedISO: "2026-09-27T10:00:00Z",
};

assert.ok(validListing(base));
assert.ok(!validListing({ ...base, url: "https://evil.example/item/123" }), "only known sources");
assert.ok(validListing({ ...base, url: "https://www.facebook.com/groups/quebecvelo/posts/123/" }), "group posts allowed");
assert.ok(validListing({ ...base, url: "https://www.kijiji.ca/v-road-bike/ottawa/cervelo-p2/123" }), "kijiji allowed");
assert.ok(!validListing({ ...base, status: "whatever" }), "unknown status rejected");
assert.ok(!validListing({ ...base, id: "12a" }), "ids are numeric");
assert.ok(validListing({ ...base, id: "kijiji-1743545473" }), "kijiji ids allowed");
assert.ok(!validListing({ ...base, id: "kijiji-" }), "kijiji id needs a number");

const g = groupListings([
  { ...base, id: "1", status: "needs-ok", draft: { n: 2, purpose: "", text: "" } },
  { ...base, id: "2", status: "needs-ok", draft: { n: 1, purpose: "", text: "" } },
  { ...base, id: "3", updatedISO: "2026-09-28T00:00:00Z" },
  { ...base, id: "4" },
]);
assert.deepEqual(g.get("needs-ok")!.map((l) => l.id), ["2", "1"], "drafts ordered by number");
assert.deepEqual(g.get("watching")!.map((l) => l.id), ["3", "4"], "no margins: newest first");

const byMargin = groupListings([
  { ...base, id: "a", fairValue: 1200, allInCost: 1100 },
  { ...base, id: "b", fairValue: 1800, allInCost: 1150 },
  { ...base, id: "c" },
]);
assert.deepEqual(byMargin.get("watching")!.map((l) => l.id), ["b", "a", "c"], "biggest margin first, unknown last");
assert.equal(margin({ ...base, fairValue: 1500, target: 1000 }), 500, "falls back to target when all-in is unknown");
assert.equal(margin(base), undefined);

const now = new Date("2026-09-28T12:00:00Z");
assert.ok(!runIsStale("2026-09-28T06:00:00Z", now), "6 h old is fine");
assert.ok(runIsStale("2026-09-27T20:00:00Z", now), "16 h old means a run was missed");
assert.ok(!runIsStale(undefined, now));
console.log("listings ok");
