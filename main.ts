import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryDirectory = dirname(fileURLToPath(import.meta.url));
const botRoot = resolve(repositoryDirectory, process.env.MAKEFUN_BOT_DIR ?? "/bot");
const outputRoot = resolve(repositoryDirectory, process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const inputFile = resolve(botRoot, "POST.json");
const outputFile = resolve(outputRoot, "POST.json");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

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
  const [sourceBytes, copiedBytes] = await Promise.all([
    readFile(inputFile),
    readFile(outputFile),
  ]);
  const sourceHash = sha256(sourceBytes);
  const copiedHash = sha256(copiedBytes);
  if (copiedHash !== sourceHash) {
    throw new Error(`SHA-256 mismatch: expected ${sourceHash}, received ${copiedHash}.`);
  }
  console.log(`Handed in X post ${statusAddress[1]} (${copiedBytes.byteLength} bytes, SHA-256 verified) to ${outputFile}.`);
} catch (failure) {
  const detail = failure instanceof Error ? failure.message : String(failure);
  console.error(`Unable to hand in POST.json (${inputFile} -> ${outputFile}): ${detail}`);
  process.exitCode = 1;
}
