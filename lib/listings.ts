import type { Listing, Status } from "./types";

export const SECTIONS: { status: Status; title: string; blurb: string }[] = [
  { status: "locked", title: "Price locked", blurb: "The seller agreed. Go get it." },
  { status: "needs-ok", title: "Waiting on you", blurb: "Reply in Claude with the number to send it." },
  { status: "negotiating", title: "Negotiating", blurb: "Message out, waiting on the seller." },
  { status: "watching", title: "Watching", blurb: "Worth tracking, not worth a message yet." },
  { status: "passed", title: "Passed", blurb: "Checked and rejected." },
  { status: "gone", title: "Gone", blurb: "Sold, removed, or the seller went quiet." },
];

/** Resale value minus what the bike really costs; undefined until both are known. */
export function margin(l: Listing): number | undefined {
  const cost = l.allInCost ?? l.target;
  return l.fairValue !== undefined && cost !== undefined ? l.fairValue - cost : undefined;
}

/** A missed run means the Mac slept or Chrome was closed; say so instead of looking quiet. */
export function runIsStale(lastISO: string | undefined, now = new Date()): boolean {
  if (!lastISO) return false;
  return now.getTime() - new Date(lastISO).getTime() > 14 * 3600 * 1000;
}

/** Group listings by section; drafts sort by their number, watching by margin, the rest newest first. */
export function groupListings(listings: Listing[]): Map<Status, Listing[]> {
  const out = new Map<Status, Listing[]>(SECTIONS.map((s) => [s.status, []]));
  for (const l of listings) out.get(l.status)?.push(l);
  for (const [status, list] of out) {
    list.sort((a, b) => {
      if (status === "needs-ok") return (a.draft?.n ?? 99) - (b.draft?.n ?? 99);
      if (status === "watching" || status === "negotiating") {
        const d = (margin(b) ?? -1e9) - (margin(a) ?? -1e9);
        if (d !== 0) return d;
      }
      return b.updatedISO.localeCompare(a.updatedISO);
    });
  }
  return out;
}

export function money(n: number | undefined): string {
  return n === undefined ? "—" : `$${Math.round(n).toLocaleString("en-CA")}`;
}

/** Where listings may come from: Marketplace, the buy/sell groups Ryan joined, Kijiji. */
const SOURCES = [
  "https://www.facebook.com/marketplace/item/",
  "https://www.facebook.com/groups/",
  "https://www.kijiji.ca/",
  "https://www.pinkbike.com/buysell/",
];

/** Validate what the agent sends; reject the whole sync rather than store junk. */
export function validListing(x: unknown): x is Listing {
  const l = x as Listing;
  return (
    !!l &&
    typeof l.id === "string" &&
    /^((kijiji|pinkbike)-)?\d+$/.test(l.id) &&
    typeof l.url === "string" &&
    SOURCES.some((prefix) => l.url.startsWith(prefix)) &&
    typeof l.title === "string" &&
    typeof l.asking === "number" &&
    SECTIONS.some((s) => s.status === l.status) &&
    typeof l.verdict === "string" &&
    typeof l.firstSeenISO === "string" &&
    typeof l.updatedISO === "string"
  );
}
