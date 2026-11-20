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

  await mkdir(outputDirectory, { recursive: true });
  await copyFile(postFile, copiedPost);
  console.log(`Confirmed X post ${address[1]}; copied POST.json to ${copiedPost}.`);
  console.log(`entry.png: ${image.size} bytes`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Entry hand-in failed (${postFile} -> ${copiedPost}): ${message}`);
  process.exitCode = 1;
}
