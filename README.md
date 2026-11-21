[![make.fun GTA 6 bounty](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![Live entry rank](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![Live entry reward](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

# GTA VI Pre-Order Warranty Card — Still Covered

A 2013 GTA VI pre-order warranty is still covered after 13 years of waiting. The punchline is in the warranty terms: "Rockstar reserves the right to launch at any time, including never".

![GTA VI — PRE-ORDER WARRANTY CARD: serial GTA6-2013-001304, purchased in 2013 with a 13-year warranty and a STILL COVERED stamp. Terms: "Rockstar reserves the right to launch at any time, including never". A small white Make.fun ghost holds a magenta star coin at the bottom-right.](entry.png)

## Entry on X

- **Post:** https://x.com/bangbung169/status/2123579892554236332
- **Account:** public **@bangbung169**, posted 20 November 2026 at approximately **07:51 WIB**.
- **Play code:** `makefun-heather-mountain-thunder`

The caption contains the bounty link, **@makefunai**, and the play code. `POST.json` supplies this published post as the entry. `entry.png` is the accompanying meme, encoded as a **1024×1024 JPEG under 1 MiB** with the required filename.

## Bounty

[**Post a GTA 6 meme on X**](https://make.fun/bounty/gta6-meme-x-01) (`gta6-meme-x-01`)

**Prize pool: $500 · Top 50 paid · Deadline: Monday, 23 November 2026, 21:00 WIB (UTC+7).**

## Run the hand-in

Use **Node.js 22.18 or later**; no dependencies are needed.

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
sha256sum POST.json out/POST.json
node --check main.ts
```

`MAKEFUN_BOT_DIR` defaults to `/bot` and `MAKEFUN_OUTPUT_DIR` to `/output`. Relative directory overrides resolve from `main.ts`'s own directory. The runner creates the destination and copies `POST.json` byte-for-byte. Its validation checks the X/Twitter post address and the presence of `entry.png`, then reports the post ID and image size. Errors produce a clear message and a non-zero exit code. All operations use the Node standard library, with no network calls.

[MIT license](LICENSE).

---

Find your next bounty: [make.fun referral](https://make.fun/r/p8atzycs).
