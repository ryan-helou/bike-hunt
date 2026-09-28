import { Photo } from "@/components/Photo";
import { PushButton } from "@/components/PushButton";
import { loadState } from "@/lib/db";
import { SECTIONS, groupListings, margin, money, runIsStale } from "@/lib/listings";
import type { Listing, Status } from "@/lib/types";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Card({ l, status }: { l: Listing; status: Status }) {
  const dropped = l.firstAsking && l.firstAsking > l.asking;
  return (
    <article className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-4">
      {l.photo && status !== "passed" && status !== "gone" && <Photo src={l.photo} href={l.url} />}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <a href={l.url} className="font-semibold leading-snug underline-offset-2 hover:underline">
            {l.title}
          </a>
          <p className="mt-0.5 text-sm text-[var(--ink-3)]">
            {l.location}
            {l.driveHours !== undefined && ` · ${l.driveHours} h drive`}
            {l.size && ` · ${l.size}`}
          </p>
        </div>
        <div className="shrink-0 text-right num">
          {status === "locked" ? (
            <>
              <p className="text-lg font-semibold text-[var(--good)]">{money(l.lockedPrice)}</p>
              <p className="text-xs text-[var(--ink-3)] line-through">{money(l.asking)}</p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">{money(l.asking)}</p>
              {dropped && <p className="text-xs text-[var(--ink-3)] line-through">{money(l.firstAsking)}</p>}
            </>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-[var(--ink-2)]">{l.verdict}</p>

      {(l.fairValue || l.target || l.allInCost) && status !== "passed" && status !== "gone" && (
        <dl className="mt-3 flex gap-5 text-xs num">
          {l.fairValue && (
            <div>
              <dt className="text-[var(--ink-3)]">Worth</dt>
              <dd className="font-medium">{money(l.fairValue)}</dd>
            </div>
          )}
          {l.target && (
            <div>
              <dt className="text-[var(--ink-3)]">Aiming for</dt>
              <dd className="font-medium">{money(l.target)}</dd>
            </div>
          )}
          {l.allInCost && (
            <div>
              <dt className="text-[var(--ink-3)]">All-in</dt>
              <dd className="font-medium">{money(l.allInCost)}</dd>
            </div>
          )}
          {margin(l) !== undefined && (
            <div>
              <dt className="text-[var(--ink-3)]">Margin</dt>
              <dd className={`font-medium ${margin(l)! >= 400 ? "text-[var(--good)]" : ""}`}>{money(margin(l))}</dd>
            </div>
          )}
        </dl>
      )}

      {l.priceHistory && l.priceHistory.length > 1 && status !== "passed" && (
        <p className="mt-2 text-xs text-[var(--ink-3)] num">
          Price: {l.priceHistory.map((p) => money(p.price)).join(" → ")}
        </p>
      )}

      {l.notes && l.notes.length > 0 && status !== "passed" && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--ink-2)]">
          {l.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}

      {l.draft && status === "needs-ok" && (
        <div className="mt-3 rounded-xl bg-[var(--surface-2)] p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--ink-3)]">
            Draft {l.draft.n} · {l.draft.purpose}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{l.draft.text}</p>
          <p className="mt-2 text-xs text-[var(--ink-3)]">
            To send, reply &ldquo;send {l.draft.n}&rdquo; in Claude.
          </p>
        </div>
      )}

      {l.thread && l.thread.length > 0 && status !== "passed" && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-[var(--ink-3)]">Conversation ({l.thread.length})</summary>
          <ol className="mt-2 space-y-2">
            {l.thread.map((m, i) => (
              <li key={i} className={m.from === "us" ? "text-right" : ""}>
                <span
                  className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-left ${
                    m.from === "us" ? "bg-[var(--accent)] text-white dark:text-[var(--ground)]" : "bg-[var(--surface-2)]"
                  }`}
                >
                  {m.text}
                </span>
                <span className="block text-[10px] text-[var(--ink-3)]">{when(m.atISO)}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </article>
  );
}

export default async function Home() {
  const state = await loadState();
  const groups = groupListings(state.listings);
  const last = state.runs.at(-1);

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold">Bike Hunt</h1>
        <p className="mt-1 text-sm text-[var(--ink-3)]">
          Tri/TT, 51–56 cm, within 3 h of Laval. Close ~$1,000 on a bike worth $400+ more.
        </p>
        {runIsStale(last?.atISO) && (
          <p className="mt-3 rounded-xl bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn)]">
            No run since {when(last!.atISO)}. The Mac may have been asleep or the Claude app closed.
          </p>
        )}
        {last && (
          <p className="mt-2 text-sm text-[var(--ink-2)]">
            <span className="text-[var(--ink-3)]">Last run {when(last.atISO)}:</span> {last.summary}
          </p>
        )}
      </header>

      <div className="mb-6">
        <PushButton />
      </div>

      {state.listings.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--rule)] p-6 text-center text-sm text-[var(--ink-3)]">
          Nothing yet. The first search runs at 6am.
        </p>
      )}

      {SECTIONS.map(({ status, title, blurb }) => {
        const list = groups.get(status) ?? [];
        if (list.length === 0) return null;
        const quiet = status === "passed" || status === "gone";
        const body = (
          <div className="mt-3 space-y-3">
            {list.map((l) => (
              <Card key={l.id} l={l} status={status} />
            ))}
          </div>
        );
        return (
          <section key={status} className="mb-8">
            {quiet ? (
              <details>
                <summary className="cursor-pointer text-sm font-semibold text-[var(--ink-3)]">
                  {title} ({list.length})
                </summary>
                {body}
              </details>
            ) : (
              <>
                <h2 className="text-sm font-semibold uppercase tracking-wide">
                  {title} <span className="text-[var(--ink-3)]">({list.length})</span>
                </h2>
                <p className="text-sm text-[var(--ink-3)]">{blurb}</p>
                {body}
              </>
            )}
          </section>
        );
      })}
    </main>
  );
}
