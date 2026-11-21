const { mkdirSync, readFileSync, writeFileSync } = require("node:fs");
const { join, resolve } = require("node:path");

const scriptDirectory = __dirname;
const botDirectory = resolve(scriptDirectory, process.env.MAKEFUN_BOT_DIR || "/bot");
const outputDirectory = resolve(scriptDirectory, process.env.MAKEFUN_OUTPUT_DIR || "/output");

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function readEntryFile(name) {
  const filePath = join(botDirectory, name);
  try {
    return readFileSync(filePath);
  } catch (error) {
    throw new Error(`Cannot read ${filePath}: ${errorMessage(error)}`);
  }
}

function extractPostId(value) {
  const problem = "POST.json url must be an HTTP(S) x.com or twitter.com status URL with a numeric post ID";
  if (typeof value !== "string") throw new Error(problem);
  let address;
  try {
    address = new URL(value);
  } catch {
    throw new Error(problem);
  }
  const allowedHost = /^(?:(?:www|mobile)\.)?(?:x\.com|twitter\.com)$/;
  const statusPath = /^\/(?:[A-Za-z0-9_]+\/status(?:es)?|i\/web\/status)\/([0-9]+)\/?$/;
  const match = statusPath.exec(address.pathname);
  if (!allowedHost.test(address.hostname) || !match ||
      !["https:", "http:"].includes(address.protocol) ||
      address.username || address.password || address.port) {
    throw new Error(problem);
  }
  return match[1];
}

function jpegSize(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error("entry.png must contain JPEG data: missing start-of-image marker");
  }
  const frameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let cursor = 2;
  while (cursor < bytes.length) {
    if (bytes[cursor++] !== 0xff) throw new Error("Invalid JPEG marker in entry.png");
    while (cursor < bytes.length && bytes[cursor] === 0xff) cursor++;
    if (cursor === bytes.length) throw new Error("Truncated JPEG marker in entry.png");
    const marker = bytes[cursor++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0x00 || marker === 0xd8) throw new Error("Unexpected JPEG marker in entry.png");
    if (cursor + 2 > bytes.length) throw new Error("Truncated JPEG segment length in entry.png");
    const length = bytes.readUInt16BE(cursor);
    if (length < 2 || cursor + length > bytes.length) {
      throw new Error("Invalid or truncated JPEG segment in entry.png");
    }
    if (frameMarkers.has(marker)) {
      if (length < 8) throw new Error("Incomplete JPEG frame header in entry.png");
      // Frame payload: precision, height, width, component count, component records.
      const height = bytes.readUInt16BE(cursor + 3);
      const width = bytes.readUInt16BE(cursor + 5);
      const components = bytes[cursor + 7];
      if (!width || !height || !components || length !== 8 + 3 * components) {
        throw new Error("Malformed JPEG frame header in entry.png");
      }
      return { width, height };
    }
    cursor += length;
  }
  throw new Error("entry.png has no JPEG start-of-frame header before image data");
}

try {
  const postBytes = readEntryFile("POST.json");
  if (postBytes.length > 16384) throw new Error("POST.json exceeds the 16,384-byte limit");
  const post = JSON.parse(postBytes.toString("utf8"));
  if (!post || typeof post !== "object" || Array.isArray(post)) {
    throw new Error("POST.json must be a JSON object containing a url");
  }
  const postId = extractPostId(post.url);
  const imageBytes = readEntryFile("entry.png");
  const { width, height } = jpegSize(imageBytes);
  if (width !== 1024 || height !== 1024) {
    throw new Error(`entry.png must be 1024x1024 pixels; found ${width}x${height}`);
  }
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, "POST.json"), postBytes);
  console.log(`Post ID: ${postId}`);
  console.log(`Image: JPEG ${width}x${height} (${imageBytes.length} bytes)`);
} catch (error) {
  console.error(`Gaming contract verification failed: ${errorMessage(error)}`);
  process.exitCode = 1;
}
