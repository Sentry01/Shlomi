import { DEFAULT_QUEUE_PATH, findSeed, loadSeedQueue } from './blog-workflow-lib.mjs';

export function renderResearchPrompt(queue, seedId) {
  const seed = findSeed(queue, seedId);

  if (seed.status !== 'approved-for-research') {
    throw new Error(
      `Seed "${seed.id}" must be approved-for-research before research starts.`,
    );
  }

  return `Create a research packet for the approved seed "${seed.title}".

Use this seed angle:
- ${seed.angle}

Write the research packet to:
- ${seed.researchPath}

Keep this future draft target in mind, but do not publish anything:
- ${seed.draftPath}

Requirements:
- Gather evidence, examples, and counterpoints that support or challenge the seed.
- Organize the packet so it can feed a later Astro blog draft.
- Do not publish anything.
- Do not create or update a released post.
- If you create any draft scaffolding later, it must remain \`draft: true\`.
`;
}

async function main(argv = process.argv.slice(2)) {
  const seedId = argv[0];
  if (!seedId) {
    throw new Error('Usage: node scripts/blog-research-prompt.mjs <seed-id>');
  }

  const queue = await loadSeedQueue(DEFAULT_QUEUE_PATH);
  console.log(renderResearchPrompt(queue, seedId));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
