import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const botDirectory = resolve(scriptDirectory, process.env.MAKEFUN_BOT_DIR ?? "/bot");
const outputDirectory = resolve(scriptDirectory, process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const postFile = resolve(botDirectory, "POST.json");
const copiedPost = resolve(outputDirectory, "POST.json");

try {
  const post = JSON.parse(await readFile(postFile, "utf8"));
  const address = typeof post?.url === "string"
    ? /^https:\/\/(?:x\.com|www\.x\.com|(?:www\.|mobile\.|m\.)?twitter\.com)\/[A-Za-z0-9_]{1,15}\/status\/([0-9]+)$/.exec(post.url)
    : null;

  if (!address) {
    throw new Error(
      "POST.json must contain an X post URL: https://x.com/<handle>/status/<digits> (twitter.com variants accepted).",
    );
  }

  const imageFile = resolve(botDirectory, "entry.png");
  const image = await stat(imageFile);
  if (!image.isFile()) {
    throw new Error(`entry.png must be a file next to POST.json: ${imageFile}`);
  }

  const imageBytes = await readFile(imageFile);
  let dimensions;
  let offset = 2;
  if (imageBytes.length >= 2 && imageBytes.readUInt16BE(0) === 0xffd8) {
    while (offset + 4 <= imageBytes.length) {
      if (imageBytes[offset++] !== 0xff) break;
      while (imageBytes[offset] === 0xff) offset++;
      const marker = imageBytes[offset++];
      if (marker === 0xda || marker === 0xd9 || offset + 2 > imageBytes.length) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      const length = imageBytes.readUInt16BE(offset);
      if (length < 2 || offset + length > imageBytes.length) break;
      // JPEG frame headers carry pixel dimensions; C4, C8, and CC are other segment types.
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        if (length >= 8) {
          dimensions = {
            width: imageBytes.readUInt16BE(offset + 5),
            height: imageBytes.readUInt16BE(offset + 3),
          };
        }
        break;
      }
      offset += length;
    }
  }
  if (!dimensions) {
    throw new Error("Cannot decode entry.png's JPEG pixel dimensions: missing or malformed frame header.");
  }
  if (dimensions.width !== 1024 || dimensions.height !== 1024) {
    throw new Error(`entry.png must decode to exactly 1024x1024 pixels; found ${dimensions.width}x${dimensions.height}.`);
  }

  await mkdir(outputDirectory, { recursive: true });
  await copyFile(postFile, copiedPost);
  console.log(`Confirmed X post ${address[1]}; copied POST.json to ${copiedPost}.`);
  console.log(`entry.png: ${image.size} bytes; ${dimensions.width}x${dimensions.height} pixels`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Entry hand-in failed (${postFile} -> ${copiedPost}): ${message}`);
  process.exitCode = 1;
}
