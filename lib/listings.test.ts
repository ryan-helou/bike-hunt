import assert from "node:assert/strict";
import { groupListings, validListing } from "./listings";
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
assert.ok(!validListing({ ...base, url: "https://evil.example/item/123" }), "only Marketplace links");
assert.ok(!validListing({ ...base, status: "whatever" }), "unknown status rejected");
assert.ok(!validListing({ ...base, id: "12a" }), "ids are numeric");

const g = groupListings([
  { ...base, id: "1", status: "needs-ok", draft: { n: 2, purpose: "", text: "" } },
  { ...base, id: "2", status: "needs-ok", draft: { n: 1, purpose: "", text: "" } },
  { ...base, id: "3", updatedISO: "2026-09-28T00:00:00Z" },
  { ...base, id: "4" },
]);
assert.deepEqual(g.get("needs-ok")!.map((l) => l.id), ["2", "1"], "drafts ordered by number");
assert.deepEqual(g.get("watching")!.map((l) => l.id), ["3", "4"], "newest first");
console.log("listings ok");
