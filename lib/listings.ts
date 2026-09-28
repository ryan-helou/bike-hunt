import type { Listing, Status } from "./types";

export const SECTIONS: { status: Status; title: string; blurb: string }[] = [
  { status: "locked", title: "Price locked", blurb: "The seller agreed. Go get it." },
  { status: "needs-ok", title: "Waiting on you", blurb: "Reply in Claude with the number to send it." },
  { status: "negotiating", title: "Negotiating", blurb: "Message out, waiting on the seller." },
  { status: "watching", title: "Watching", blurb: "Worth tracking, not worth a message yet." },
  { status: "passed", title: "Passed", blurb: "Checked and rejected." },
  { status: "gone", title: "Gone", blurb: "Sold, removed, or the seller went quiet." },
];

/** Group listings by section; drafts sort by their number, the rest newest first. */
export function groupListings(listings: Listing[]): Map<Status, Listing[]> {
  const out = new Map<Status, Listing[]>(SECTIONS.map((s) => [s.status, []]));
  for (const l of listings) out.get(l.status)?.push(l);
  for (const [status, list] of out) {
    list.sort((a, b) =>
      status === "needs-ok"
        ? (a.draft?.n ?? 99) - (b.draft?.n ?? 99)
        : b.updatedISO.localeCompare(a.updatedISO),
    );
  }
  return out;
}

export function money(n: number | undefined): string {
  return n === undefined ? "—" : `$${Math.round(n).toLocaleString("en-CA")}`;
}

/** Validate what the agent sends; reject the whole sync rather than store junk. */
export function validListing(x: unknown): x is Listing {
  const l = x as Listing;
  return (
    !!l &&
    typeof l.id === "string" &&
    /^\d+$/.test(l.id) &&
    typeof l.url === "string" &&
    l.url.startsWith("https://www.facebook.com/marketplace/item/") &&
    typeof l.title === "string" &&
    typeof l.asking === "number" &&
    SECTIONS.some((s) => s.status === l.status) &&
    typeof l.verdict === "string" &&
    typeof l.firstSeenISO === "string" &&
    typeof l.updatedISO === "string"
  );
}
