import webpush, { type WebPushError } from "web-push";
import { allSubs, removeSub } from "./db";

export function pushConfigured(): boolean {
  return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

export async function sendPush(p: { title: string; body?: string; tag?: string }) {
  if (!pushConfigured()) return { sent: 0, failed: 0, pruned: 0, skipped: "not-configured" as const };
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:bike-hunt@localhost",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  const subs = await allSubs();
  if (subs.length === 0) return { sent: 0, failed: 0, pruned: 0, skipped: "no-devices" as const };
  let sent = 0, failed = 0, pruned = 0;
  const body = JSON.stringify({ title: p.title, body: p.body, tag: p.tag ?? "bike-hunt", url: "/" });
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(s, body, { TTL: 12 * 3600 });
        sent++;
      } catch (e) {
        const code = (e as WebPushError).statusCode;
        // 404/410: the device unsubscribed or the PWA was removed; retrying forever gets us rate-limited.
        if (code === 404 || code === 410) {
          await removeSub(s.endpoint);
          pruned++;
        } else failed++;
      }
    }),
  );
  return { sent, failed, pruned };
}
