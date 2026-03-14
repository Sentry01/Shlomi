import { DEFAULT_QUEUE_PATH, findSeed, loadSeedQueue } from './blog-workflow-lib.mjs';

export function renderDraftPrompt(queue, seedId) {
  const seed = findSeed(queue, seedId);

  if (!['approved-for-research', 'draft-review'].includes(seed.status)) {
    throw new Error(
      `Seed "${seed.id}" must be approved-for-research before drafting starts.`,
    );
  }

  return `Create an Astro blog draft for "${seed.title}" from the approved editorial seed.

Inputs:
- Queue item: content-ops/blog-seeds.json
- Research packet: ${seed.researchPath}

Write the draft to:
- ${seed.draftPath}

Draft rules:
- Reuse the existing Astro blog frontmatter shape.
- Keep this line in frontmatter: draft: true
- Do not publish anything.
- When the draft is ready for human review, update the queue item status to \`draft-review\`.
`;
}

async function main(argv = process.argv.slice(2)) {
  const seedId = argv[0];
  if (!seedId) {
    throw new Error('Usage: node scripts/blog-draft-prompt.mjs <seed-id>');
  }

  const queue = await loadSeedQueue(DEFAULT_QUEUE_PATH);
  console.log(renderDraftPrompt(queue, seedId));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
