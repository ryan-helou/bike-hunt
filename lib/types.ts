// A listing is one Marketplace ad. The local agent owns the data (data/tracker.json)
// and syncs the whole set here; the app only displays it.

export type Status =
  | "needs-ok" // a draft is waiting for Ryan's "send" in Claude
  | "locked" // the seller agreed to a price the agent would buy at
  | "negotiating" // a message is out, waiting on the seller
  | "watching" // interesting, not worth messaging yet
  | "passed" // rejected, with a reason
  | "gone"; // sold, deleted, or dead thread

export interface ThreadMessage {
  atISO: string;
  from: "us" | "seller";
  text: string;
}

export interface Draft {
  /** The number Ryan says in chat: "send 2". */
  n: number;
  purpose: string;
  text: string;
}

export interface Listing {
  id: string; // Marketplace item id
  url: string;
  title: string;
  location: string;
  driveHours?: number;
  asking: number; // current asking price, CAD
  firstAsking?: number;
  /** The agent's estimate of fair used value, CAD. */
  fairValue?: number;
  /** Price the agent is aiming to close at. */
  target?: number;
  /** Price the seller has agreed to, when locked. */
  lockedPrice?: number;
  size?: string;
  status: Status;
  verdict: string; // one line: why it's here
  notes?: string[];
  photo?: string;
  draft?: Draft;
  thread?: ThreadMessage[];
  firstSeenISO: string;
  updatedISO: string;
}

export interface Run {
  atISO: string;
  summary: string;
  searched: number;
  newListings: number;
}

export interface HuntState {
  listings: Listing[];
  runs: Run[];
}
