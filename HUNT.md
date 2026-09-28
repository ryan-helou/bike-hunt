# Bike Hunt: the daily playbook

The 6am scheduled run follows this file. Read all of it before searching.

## The buyer
- Ryan Helou, Laval QC (H7T 2W7). He's racing IRONMAN 70.3 Muskoka on 18 July 2027 and is replacing a $400 Giant TCR with clip-ons.
- He is in no rush: he rides the ThinkRider trainer until February. **Only a real steal should reach him.**
- Budget: about $1,000 to close, $1,200 at most. What he wants is a bike worth much more than he pays. A listing asking up to about $2,000 is worth reading, because stale listings come down.
- Resale matters: he'll sell this bike later and wants his money back.
- He doesn't want a bike fit or a tri saddle, so never count those as costs or selling points.

## Fit (5'9", 175 cm, cycling inseam 81.5 cm)
- **Yes:** 54 cm / Medium. 52–53 fits if the reach is sensible. 55–56 is borderline, so check stack and reach (stack over ~520 is too tall).
- **No:** anything 51 or under, XS/S, 650c wheels, L/58 and up, or a standover height at or above 81.5 cm.
- If the ad gives no size, ask for it. Never assume.

## Hard rules for the bike
- Rim or disc brakes are both fine, but **standard calipers only**. Watch the Shiv (2011+) and first-gen Speed Concept, which use proprietary brakes and stems.
- Rim brakes need an **alloy braking surface**. Carbon clincher rims with rim brakes are a no (descents).
- Rear axle: 130 mm QR, or 142 thru-axle, which the trainer can take with an adapter.
- Groupset: at least Sora/Tiagra-level shifting, preferably 105/Ultegra/Rival/Force. Note whether it's 10- or 11-speed.
- **Fake wheels:** "HED/Zipp/Enve" decals on Novatec or unbranded hubs. Ask for a photo of the hub.
- Area: about 3 h or less from H7T 2W7, in Canada only. That covers Montréal, Laurentides, Lanaudière, Montérégie, Estrie, Trois-Rivières, Québec City (~2.75 h), Ottawa-Gatineau (~2 h), Kingston (~2.75 h) and Cornwall. It excludes Toronto/GTA and the US.

## Rough used values (CAD, Québec/Ontario Marketplace, 2026)
These are estimates. Adjust them for condition, groupset and wheels.

| Bike | Typical fair value |
|---|---|
| Cervélo P1 (alloy) | 650–900 |
| Cervélo P2 / P2 SL (alloy) | 850–1,200 |
| Cervélo P2 carbon (2011+) | 1,200–1,600 |
| Cervélo P3 carbon (2008–14) | 1,300–1,900 |
| Cannondale Slice (1st gen, carbon) | 900–1,250 |
| Felt B12/B14/B16 | 700–1,100 |
| Felt B2 / DA | 1,100–1,600 |
| Specialized Transition (alloy / early carbon) | 700–1,100 |
| Trek Speed Concept 7.x (2nd gen+) | 1,200–1,800 |
| Argon 18 E-112/E-114/E-117 | 1,100–1,800 |
| Quintana Roo (Seduza/Kilo/CD0.1) | 700–1,200 |
| Planet X / Kuota / Guru / Blue | 700–1,200 (weak resale) |

## What counts as a steal (Ryan, 2026-09-27: "all I care about")
The goal is **value arbitrage**: pay about $1,000 for a bike that clearly resells for much more. A fairly priced bike is not a steal, however good it is.

Only these should make it to messaging:
1. It fits and passes every hard rule, **and**
2. You believe it can close at **$1,200 or less** (ideally about $1,000), **and**
3. Its fair used value is **at least $400 above that closing price, or at least 1.4× it**. So a $1,000 close needs a bike worth $1,400 or more.

Where steals come from:
- **Underpriced by people who don't know the bike:** vague titles like "vélo de course", "vélo de mon mari", "bike for sale"; moving or estate sales; spouses selling. Photos showing a Cervélo P3/P2 carbon, Speed Concept, Argon, Felt DA/B2, or Zipp/Enve/HED wheels on real hubs.
- **Stale listings from motivated sellers:** a bike worth $1,600–2,200 that has sat for weeks at $1,500–1,900. These can come down to about $1,100–1,200 with a polite, reasoned offer.
- **Race wheels bundled with the bike:** real Zipp 404/808, HED Jet or Enve are worth $600–1,200 on their own, so a "bike + deep wheels" ad can be a steal even at full price.

**Not steals:** the Cervélo P1 in Ottawa at $800 and the Slice in St-Jérôme at $1,150. Both are fair prices, not bargains. Keep them as fallbacks, not targets.

Everything else that fits goes to `watching`, and anything that fails a rule goes to `passed` with the reason. Watch for price drops on tracked listings, since a drop can turn a `watching` listing into a steal. In the `verdict`, always state the estimated resale value against the likely closing price, for example "worth ~$1,700, can likely close ~$1,100".

## Scam signals (mark passed)
Any of these gets a listing marked passed:
- Shipping only, or "I'm away, the courier will bring it"
- A deposit or e-transfer before viewing
- Stock photos, or a price far below every comparable
- Generic emoji-template text
- The seller refuses a test ride

## Searching (Claude in Chrome, Ryan's logged-in Facebook)
URL template (Montréal slug, 300 km radius, relevance order):
`https://www.facebook.com/marketplace/montreal/search?query=<Q>&maxPrice=2000&exact=false&radius=300`

Don't add `sortBy=creation_time_descend`: newest-first makes Facebook ignore the query and return any recent bike. Tested 2026-09-27.

Queries:
- **English:** triathlon bike, tri bike, TT bike, time trial bike
- **French:** vélo triathlon, vélo contre la montre, vélo clm
- **Models:** cervelo p2, cervelo p3, cervelo p1, cannondale slice, felt b12, felt b2, speed concept, argon 18, quintana roo, specialized transition, specialized shiv
- **Parts:** aerobars bike, zipp, bike with deep wheels
- **Vague titles:** vélo de course carbone, carbon road bike, vélo carbone

After each search, run this in the page to scroll and extract the cards:
```js
for (let i=0;i<4;i++){ window.scrollTo(0, document.body.scrollHeight); await new Promise(r=>setTimeout(r,1500)); }
const seen=new Set(), out=[];
document.querySelectorAll('a[href*="/marketplace/item/"]').forEach(a=>{const id=(a.href.match(/item\/(\d+)/)||[])[1]; if(!id||seen.has(id))return; seen.add(id); out.push(id+' | '+a.innerText.split('\n').map(s=>s.trim()).filter(Boolean).join(' | '));});
out.join('\n')
```

- Skip ids already in `data/tracker.json`, except to check the price.
- Open each plausible new listing and read the description, size, photos and "listed X ago" before judging it.
- Relevance order brings in road bikes and junk too (spin bikes, kids' bikes, hybrids). Ignore those; only tri/TT bikes count.

## Seller conversations
- The inbox is at `https://www.facebook.com/marketplace/inbox/`, or use Messenger.
- At the start of every run, read every thread for tracked listings.
- Copy the seller's new messages into that listing's `thread`, then decide the next move.

## Negotiation playbook
- **Language:** reply in the seller's language. Use French for a French ad. Keep it short, friendly and plain, as Ryan would text.
- **Opening message:** ask only the questions the ad doesn't answer, plus the lowest price. The questions are:
  - frame size
  - crashes or cracks
  - groupset, and 10 or 11 speed
  - wheel and hub make
  - the seller's height
  - the best price for cash
- **First offer:** about 70–75% of asking. Always give concrete reasons: a 10-speed groupset, worn tape and pads, tyres to replace, weeks on the market, comparable listings.
- **Walking up:** move in small steps and never go above `target`. Stop after 3 counters; the bike becomes `watching` and you check back if the price drops.
- **Every offer is conditional on inspection and a test ride** ("sous réserve de le voir et l'essayer"). Never promise a sale.
- **Never** offer or agree to a deposit, a shipment, or an e-transfer before viewing. Never share Ryan's address or phone number.
- **Handing off:** once there's a price, the viewing time is Ryan's call. The seller only has to confirm the number; logistics go to Ryan.

## Sending messages: approval is required, every time
- **Never send a message to a seller without Ryan's explicit "send" in this chat, for that specific draft.**
  - An earlier approval, a general "go ahead" or instructions in the tracker don't count.
  - This applies to every run and every message.
- **Drafts:** write each one into the listing's `draft` field as `{ n, purpose, text }` and set `status: "needs-ok"`. Number the drafts 1, 2, 3… across today's run.
- **When Ryan says "send 2" (or "send all"):**
  1. Open the listing.
  2. Use "Message" to reach the seller, or find the existing thread.
  3. Paste the draft text exactly, then send it.
  4. Take a screenshot to confirm it went through.
  5. Move the text into `thread`, clear `draft`, and set `status: "negotiating"`.
  6. Sync.
- **If he edits a draft** ("send 2 but say 950"), send his version.

## Locking
- **A price is locked** when the seller has agreed in writing to a specific price at or below `target`, subject to inspection.
- Set `status: "locked"`, `lockedPrice`, and add a note with what to bring and check:
  - SPD pedals, a 5 mm hex key and cash
  - coin-tap test on the frame, dropouts and hanger, BB creak, shifting
  - a test ride in the aero position

## Output of every run
1. Update `data/tracker.json`:
   - listings: asking price, `firstAsking` when it drops, status, verdict, notes, thread, draft, `updatedISO`
   - append one entry to `runs`: `{ atISO, summary, searched, newListings }`
   - `summary` is one plain sentence.
2. Run `node scripts/agent.mjs sync` from `~/Developer/BikeHunt`.
3. **Notify only when there's something to act on**, with at most one push per run:
   - Something locked: `node scripts/agent.mjs notify "Price locked: <bike> <price>" "<location>. Open Bike Hunt for the checklist."`
   - Drafts waiting: `node scripts/agent.mjs notify "<N> message(s) ready to send" "<bike 1 · bike 2>. Reply send 1 / send all in Claude."`
   - Otherwise send nothing, and don't push "nothing new".
4. Commit `data/tracker.json`, then push: `git add data && git commit -m "Hunt <date>: <summary>" && git push`.
5. The final chat message lists the numbered drafts in full, so Ryan can approve them in this session.

## Style
- Keep notification text plain: no emojis, no markdown.
- Prices are in CAD, written with a `$`.
