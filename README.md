# GTA VI Gaming Contract — Signed, Sealed, Still Waiting

[![make.fun competition](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![make.fun rank](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![make.fun reward](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

After thirteen years of waiting, GTA VI's launch week calls for a signed household contract. Entry #25 replaces #22c's warranty card with solemn paperwork protecting some very unserious demands:

1. Uninterrupted play from 19–29 November 2026.
2. No walking in front of the TV during a mission.
3. Nobody gets to say “it's just a game.”

Rockstar Games appears as the witness. Break the agreement and the penalty is “thirteen (13) more years of waiting.”

![Formal paper contract headed GTA VI GAMING CONTRACT, three numbered clauses, a red APPROVED stamp surrounded by 13 YEARS IN THE MAKING, and a small white make.fun ghost with make.fun text at the bottom-left](entry.png)

## Published X entry

[@bangbung169's post](https://x.com/bangbung169/status/2124073649602724305) is the live public entry. Its text includes the [bounty link](https://make.fun/bounty/gta6-meme-x-01), mentions `@makefunai`, tells readers they can earn money on make.fun, and carries the play code `makefun-heather-mountain-thunder`.

`POST.json` supplies that published post's URL as the submission.

## Local verification

Run with Node.js 22.18 or newer. `main.ts` checks the X/Twitter status URL and extracts its numeric post ID, reads the JPEG start-of-frame header in `entry.png`, and requires exactly 1024×1024 pixels. It then copies the original `POST.json` bytes into the output directory and prints the post ID and image size. It uses only Node's standard library and makes no network requests; failures print an error and exit non-zero.

Despite its filename, `entry.png` contains JPEG data. Verification checks the file's bytes and frame header rather than trusting its extension.

`MAKEFUN_BOT_DIR` selects the input directory (default `/bot`), and `MAKEFUN_OUTPUT_DIR` selects the output directory (default `/output`). Relative overrides resolve from the directory containing `main.ts`.

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
sha256sum POST.json out/POST.json
cmp POST.json out/POST.json
node --check main.ts
rm -r out
```

The run should exit 0 and report a 1024×1024 JPEG. Both SHA-256 values must match, and `cmp` should exit 0 without printing anything. A JPEG of any other dimensions must fail verification.
