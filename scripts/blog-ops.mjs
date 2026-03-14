import {
  DEFAULT_QUEUE_PATH,
  findSeed,
  formatQueue,
  loadSeedQueue,
  saveSeedQueue,
  transitionSeed,
  validateSeedQueue,
} from './blog-workflow-lib.mjs';

const STATUS_COMMANDS = {
  'approve-research': 'approved-for-research',
  'mark-draft-review': 'draft-review',
  'approve-publish': 'approved-for-publish',
  'mark-published': 'published',
};

function usage() {
  return `Usage:
  node scripts/blog-ops.mjs list [--ready-only]
  node scripts/blog-ops.mjs show <seed-id>
  node scripts/blog-ops.mjs approve-research <seed-id>
  node scripts/blog-ops.mjs mark-draft-review <seed-id>
  node scripts/blog-ops.mjs approve-publish <seed-id>
  node scripts/blog-ops.mjs mark-published <seed-id>
  node scripts/blog-ops.mjs validate

Notes:
  - Commands that take <seed-id> accept only the queue item's id value.
  - Titles are not valid identifiers.`;
}

export async function runBlogOps(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;

  if (!command) {
    console.log(usage());
    return;
  }

  const queue = await loadSeedQueue(DEFAULT_QUEUE_PATH);

  if (command === 'list') {
    console.log(formatQueue(queue, { readyOnly: rest.includes('--ready-only') }));
    return;
  }

  if (command === 'show') {
    const seedId = rest[0];
    if (!seedId) throw new Error('show requires a seed id.');
    console.log(JSON.stringify(findSeed(queue, seedId), null, 2));
    return;
  }

  if (command === 'validate') {
    validateSeedQueue(queue);
    console.log('Blog editorial queue is valid.');
    return;
  }

  if (command in STATUS_COMMANDS) {
    const seedId = rest[0];
    if (!seedId) throw new Error(`${command} requires a seed id.`);
    const updated = transitionSeed(queue, seedId, STATUS_COMMANDS[command]);
    await saveSeedQueue(updated, DEFAULT_QUEUE_PATH);
    console.log(`Updated ${seedId} to ${STATUS_COMMANDS[command]}.`);
    return;
  }

  throw new Error(`Unknown command "${command}".\n\n${usage()}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBlogOps().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
