import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryDirectory = dirname(fileURLToPath(import.meta.url));
const botRoot = resolve(repositoryDirectory, process.env.MAKEFUN_BOT_DIR ?? "/bot");
const outputRoot = resolve(repositoryDirectory, process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const inputFile = resolve(botRoot, "POST.json");
const outputFile = resolve(outputRoot, "POST.json");

try {
  const document = JSON.parse(await readFile(inputFile, "utf8"));
  const statusAddress = typeof document?.url === "string"
    ? document.url.match(
        /^https:\/\/(?:x\.com|www\.x\.com|twitter\.com|www\.twitter\.com|mobile\.twitter\.com|m\.twitter\.com)\/[A-Za-z0-9_]{1,15}\/status\/([0-9]+)$/,
      )
    : null;

  if (statusAddress === null) {
    throw new Error(
      "POST.json needs an X post URL shaped like https://x.com/<handle>/status/<digits>; twitter.com variants are accepted.",
    );
  }

  await mkdir(outputRoot, { recursive: true });
  await copyFile(inputFile, outputFile);
  console.log(`Handed in X post ${statusAddress[1]} to ${outputFile}.`);
} catch (failure) {
  const detail = failure instanceof Error ? failure.message : String(failure);
  console.error(`Unable to hand in POST.json (${inputFile} -> ${outputFile}): ${detail}`);
  process.exitCode = 1;
}
