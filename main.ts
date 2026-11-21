import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const inputDirectory = resolve(scriptDirectory, process.env.MAKEFUN_BOT_DIR || "/bot");
const outputDirectory = resolve(scriptDirectory, process.env.MAKEFUN_OUTPUT_DIR || "/output");

function extractPostId(value) {
  const invalidUrl = "POST.json must supply an HTTP(S) X/Twitter status URL with a numeric post ID";
  if (typeof value !== "string" || value.length > 2048) {
    throw new Error(invalidUrl);
  }

  let address;
  try {
    address = new URL(value);
  } catch {
    throw new Error(invalidUrl);
  }

  const allowedHost = /^(?:(?:www|mobile)\.)?(?:x\.com|twitter\.com)$/i;
  const postPath = /^\/(?:[A-Za-z0-9_]{1,15}\/status(?:es)?|i\/web\/status)\/([0-9]+)\/?$/;
  const match = address.pathname.match(postPath);
  if (
    !["http:", "https:"].includes(address.protocol) ||
    !allowedHost.test(address.hostname) ||
    address.username || address.password || address.port || !match
  ) {
    throw new Error(invalidUrl);
  }

  const id = BigInt(match[1]);
  if (id === 0n || id >= 2n ** 64n) {
    throw new Error("POST.json post ID must be a positive integer below 2^64");
  }
  return match[1];
}

function jpegDimensions(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("entry.png must contain a JPEG, regardless of its filename");
  }

  // SOF markers describe the frame; C4, C8 and CC are different segment types.
  const frameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset++] !== 0xff) {
      throw new Error("Malformed JPEG: expected a segment marker");
    }
    while (bytes[offset] === 0xff) offset++;
    if (offset >= bytes.length) throw new Error("Truncated JPEG marker");

    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x00 || marker === 0xd8) {
      throw new Error("Malformed JPEG: unexpected marker in the header");
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > bytes.length) throw new Error("Truncated JPEG segment length");

    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) {
      throw new Error("Malformed JPEG: segment extends beyond the file");
    }
    if (frameMarkers.has(marker)) {
      if (length < 8) throw new Error("Truncated JPEG start-of-frame segment");
      const components = bytes[offset + 7];
      if (components === 0 || length !== 8 + 3 * components) {
        throw new Error("Malformed JPEG start-of-frame component table");
      }
      const height = bytes.readUInt16BE(offset + 3);
      const width = bytes.readUInt16BE(offset + 5);
      if (width === 0 || height === 0) throw new Error("JPEG frame has zero dimensions");
      return { width, height };
    }
    offset += length;
  }
  throw new Error("JPEG has no start-of-frame marker before its image scan");
}

let step = "reading POST.json";
try {
  const postBytes = readFileSync(join(inputDirectory, "POST.json"));
  step = "validating POST.json";
  if (postBytes.length > 16384) throw new Error("POST.json exceeds the 16384-byte limit");
  const post = JSON.parse(postBytes.toString("utf8"));
  if (!post || typeof post !== "object" || Array.isArray(post)) {
    throw new Error("POST.json must be a JSON object");
  }
  const postId = extractPostId(post.url);

  step = "reading entry.png";
  const imageBytes = readFileSync(join(inputDirectory, "entry.png"));
  step = "validating entry.png";
  const { width, height } = jpegDimensions(imageBytes);
  if (width !== 1024 || height !== 1024) {
    throw new Error(`entry.png must be 1024x1024 pixels; found ${width}x${height}`);
  }

  step = "copying POST.json to the output directory";
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, "POST.json"), postBytes);
  console.log(`Post ID: ${postId}`);
  console.log(`Image: JPEG ${width}x${height} (${imageBytes.length} bytes)`);
  console.log("POST.json copied byte-for-byte");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Entry verification failed while ${step}: ${message}`);
  process.exitCode = 1;
}
