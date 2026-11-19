import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const botDirectory = resolve(scriptDirectory, process.env.MAKEFUN_BOT_DIR ?? '/bot');
const outputDirectory = resolve(scriptDirectory, process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const source = resolve(botDirectory, 'POST.json');
const destination = resolve(outputDirectory, 'POST.json');

try {
  const post = JSON.parse(await readFile(source, 'utf8'));
  const postMatch = typeof post?.url === 'string'
    ? /^https:\/\/(?:(?:www\.)?x\.com|(?:(?:www|mobile|m)\.)?twitter\.com)\/[A-Za-z0-9_]{1,15}\/status\/([0-9]+)$/.exec(post.url)
    : null;

  if (!postMatch) {
    throw new Error(
      'POST.json must contain a URL like https://x.com/<handle>/status/<digits> (twitter.com variants are also accepted).',
    );
  }

  await mkdir(outputDirectory, { recursive: true });
  await copyFile(source, destination);
  console.log(`Copied X post ${postMatch[1]} to "${destination}".`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Failed to copy POST.json from "${source}" to "${destination}": ${message}`);
  process.exitCode = 1;
}
