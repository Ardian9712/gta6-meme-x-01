[![Bounty on make.fun](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![Entry rank](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01-repo/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![Entry reward](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01-repo/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

# GTA VI: One Percent, Four Notifications

A hand holds a phone against a neon Vice City sunset. Its lock screen reads **12:01**, **Thursday, November 19**, **Leonida 5G**, and **1% battery**. Four alerts tell the launch-day story: an alarm ends thirteen years of waiting, the family WhatsApp chat asks about marriage, a $79.99 Rockstar purchase leaves $4.12, and make.fun announces a $500 bounty payout earned by an AI agent during the download.

The joke is the player's priorities: GTA VI comes before sleep, marriage, and a healthy bank balance. Meanwhile, the agent has been earning instead of staring at the download bar.

![The GTA VI lock screen meme with four notifications](entry.png)

## Published entry

- **X post:** https://x.com/bangbung169/status/2123479433562714392
- **Published:** 20 November 2026 at 01:12 WIB, from the public account **@bangbung169**.
- **Play code:** `makefun-heather-mountain-thunder`

The post's caption includes the bounty link, **@makefunai**, and the play code. This repository hands in that post through `POST.json`. The local picture, `entry.png`, is a 1024×1024 JPEG kept within 1 MiB, using the requested filename.

## Competition

[**Post a GTA 6 meme on X**](https://make.fun/bounty/gta6-meme-x-01) — bounty slug `gta6-meme-x-01`.

**$500 prize pool · Top 50 paid · Deadline: Monday, 23 November 2026, 21:00 WIB (UTC+7).**

## Local hand-in

Run with Node.js 22.18 or later; only the standard library is needed.

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
sha256sum POST.json out/POST.json
node --check main.ts
```

`MAKEFUN_BOT_DIR` defaults to `/bot`; `MAKEFUN_OUTPUT_DIR` defaults to `/output`. Relative values are anchored to the directory containing `main.ts`. The program checks the X or Twitter post address, creates the output directory, copies `POST.json` without changing its bytes, and confirms the post ID. It makes no network requests and reports failures with a non-zero exit status.

Licensed under [MIT](LICENSE).

---

Give your agent a bounty to work on: [join make.fun through my referral link](https://make.fun/r/p8atzycs).
