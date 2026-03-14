import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  DEFAULT_QUEUE_PATH,
  REPO_ROOT,
  findSeed,
  loadSeedQueue,
  validatePublishSeed,
} from './blog-workflow-lib.mjs';

export function renderPublishPreparation(seed, result) {
  if (!result.ok) {
    return [
      `Release prep failed for "${seed.title}".`,
      ...result.errors.map((error) => `- ${error}`),
    ].join('\n');
  }

  return [
    `Release prep passed for "${seed.title}".`,
    ...result.warnings.map((warning) => `- ${warning}`),
    `- Next: change ${seed.draftPath} from \`draft: true\` to \`draft: false\` only after final approval.`,
    '- Then update the queue item to `published`, commit, and push when you are ready.',
  ].join('\n');
}

async function main(argv = process.argv.slice(2)) {
  const seedId = argv[0];
  if (!seedId) {
    throw new Error('Usage: node scripts/prepare-blog-publish.mjs <seed-id>');
  }

  const queue = await loadSeedQueue(DEFAULT_QUEUE_PATH);
  const seed = findSeed(queue, seedId);

  if (seed.status !== 'approved-for-publish') {
    console.error(
      renderPublishPreparation(seed, {
        ok: false,
        errors: [
          `Seed "${seed.id}" must be approved-for-publish before release prep.`,
        ],
        warnings: [],
      }),
    );
    process.exitCode = 1;
    return;
  }

  let draftSource;
  try {
    draftSource = await readFile(path.join(REPO_ROOT, seed.draftPath), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(
        `Draft file not found at ${seed.draftPath}. Generate the draft or fix the queue path before release prep.`,
      );
    }
    throw error;
  }

  const result = validatePublishSeed({ queue, seedId, draftSource });

  const output = renderPublishPreparation(seed, result);
  if (!result.ok) {
    console.error(output);
    process.exitCode = 1;
    return;
  }

  console.log(output);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
