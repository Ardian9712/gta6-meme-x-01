# GTA VI Pre-Order Warranty Card — Still Covered

[![make.fun competition](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![make.fun rank](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![make.fun reward](https://make.fun/badge/gta6-meme-x-01/Ardian9712/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

A GTA VI pre-order from 2013 has spent thirteen years waiting for the game, yet its thirteen-year warranty is **STILL COVERED**. The fine print explains this remarkable service:

> Rockstar reserves the right to launch at any time, including never

Entry **#22c** replaces the **#21 diet-timeline** meme in this repository.

![GTA VI pre-order warranty card, serial GTA6-2013-001304, purchased in 2013, with a 13-year warranty and STILL COVERED stamp; a small white Make.fun ghost holds a magenta star coin at the bottom-right.](entry.png)

## Published X post

The entry is the public post at <https://x.com/bangbung169/status/2124042323055296874>.

Its text includes [the bounty link](https://make.fun/bounty/gta6-meme-x-01), `@makefunai`, and the play code `makefun-heather-mountain-thunder`. `POST.json` supplies this published post to the make.fun runner.

## Local verification

`main.ts` runs directly on Node.js 22.18 or later using only Node's standard library. It reads the colocated `POST.json`, validates an X or Twitter status address, and extracts its numeric post ID without losing precision. It reads `entry.png` as bytes and finds the JPEG start-of-frame dimensions: the file is a JPEG despite its `.png` name, and must measure exactly **1024 × 1024** pixels.

After validation, the script writes the original `POST.json` bytes into the output directory. It reports the post ID, image dimensions, and image byte count, exiting with code 0. Invalid input, unreadable files, and output errors produce a contextual error and a non-zero exit code. All checks are local, with no network requests or external packages.

Run these commands from the repository directory:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
sha256sum POST.json out/POST.json
node --check main.ts
```

The two SHA-256 values must match. The successful image report should show `JPEG 1024x1024 (580000 bytes)`.

The runner defaults to `/bot` for inputs and `/output` for output. Set `MAKEFUN_BOT_DIR` and `MAKEFUN_OUTPUT_DIR` to override those directories. Relative override paths are resolved from `main.ts`'s own directory, so they behave consistently even when the script is launched elsewhere.
