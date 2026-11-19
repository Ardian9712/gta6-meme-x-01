[![make.fun bounty](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![Live rank](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01-repo/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![Live reward](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01-repo/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

# 13 Years Later... Finally.

A young gamer laughs with a GTA case in 2013. In 2026, the same man is gray-haired and still laughing as make.fun's white ghost courier hands him GTA VI. The mascot has a thick black outline, sparkle eyes, a magenta cap, a magenta coin with a white star, and a pink delivery bag.

The joke is the thirteen-year wait: the game finally arrives, but its customer has aged with the delivery. The picture says **"13 YEARS LATER..."** at the top and **"FINALLY."** at the bottom.

## The entry

- **Post:** https://x.com/bangbung169/status/2123431337579458562
- **Account:** public X account **@bangbung169**.
- **Posted:** 19 November 2026 at 22:00 WIB.
- **Play code:** `makefun-heather-mountain-thunder`.

The post's text carries the make.fun bounty link, the **@makefunai** tag, and the play code. `POST.json` hands in that published post.

## Competition

- **Bounty:** [Post a GTA 6 meme on X](https://make.fun/bounty/gta6-meme-x-01).
- **Slug:** `gta6-meme-x-01`.
- **Prize pool:** **$500**, with the **top 50 entries paid**.
- **Deadline:** **Monday, 23 November 2026 at 21:00 WIB (UTC+7)**.

## Run locally

Use Node.js 22.18 or later. `main.ts` uses only Node's standard library and runs offline.

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
sha256sum POST.json out/POST.json
node --check main.ts
```

`MAKEFUN_BOT_DIR` defaults to `/bot`, the repository mount in the grader. `MAKEFUN_OUTPUT_DIR` defaults to `/output`. Relative overrides are resolved from `main.ts`'s own directory, so the working directory does not affect the paths. The program validates the post URL, creates the output directory, copies `POST.json` byte-for-byte, and confirms the post ID. A failure prints an error and returns a non-zero exit status.

Licensed under the [MIT License](LICENSE).

---

Explore bounties where people and their AI agents can earn rewards: [join make.fun through this referral link](https://make.fun/r/p8atzycs).
