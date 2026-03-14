import assert from 'node:assert/strict';
import { execFile as execFileCallback } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

import {
  STATUSES,
  createQueue,
  findSeed,
  parseFrontmatter,
  transitionSeed,
  validatePublishSeed,
  validateSeedQueue,
} from '../scripts/blog-workflow-lib.mjs';
import { renderDraftPrompt } from '../scripts/blog-draft-prompt.mjs';
import { renderResearchPrompt } from '../scripts/blog-research-prompt.mjs';

const execFile = promisify(execFileCallback);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sampleQueue() {
  return createQueue([
    {
      id: 'the-better-trap',
      title: 'The Better Trap',
      status: 'idea-review',
      angle:
        'A stronger model is not the same thing as a stronger software delivery system.',
      researchPath: 'content-ops/research/the-better-trap.md',
      draftPath: 'src/content/blog/the-better-trap.md',
    },
  ]);
}

test('validateSeedQueue accepts a well-formed backlog item', () => {
  const queue = sampleQueue();

  assert.doesNotThrow(() => validateSeedQueue(queue));
  assert.deepEqual(STATUSES, [
    'idea-review',
    'approved-for-research',
    'draft-review',
    'approved-for-publish',
    'published',
  ]);
});

test('transitionSeed only allows explicit approval gates', () => {
  const queue = sampleQueue();

  const approvedForResearch = transitionSeed(
    queue,
    'the-better-trap',
    'approved-for-research',
  );
  assert.equal(approvedForResearch.items[0].status, 'approved-for-research');

  const readyForDraftReview = transitionSeed(
    approvedForResearch,
    'the-better-trap',
    'draft-review',
  );
  assert.equal(readyForDraftReview.items[0].status, 'draft-review');

  assert.throws(
    () => transitionSeed(queue, 'the-better-trap', 'approved-for-publish'),
    /Invalid status transition/,
  );
});

test('renderResearchPrompt includes safety rails and output path', () => {
  const queue = transitionSeed(
    sampleQueue(),
    'the-better-trap',
    'approved-for-research',
  );
  const prompt = renderResearchPrompt(queue, 'the-better-trap');

  assert.match(prompt, /The Better Trap/);
  assert.match(prompt, /content-ops\/research\/the-better-trap\.md/);
  assert.match(prompt, /Do not publish anything/);
  assert.match(prompt, /do not create or update a released post/i);
});

test('renderDraftPrompt keeps the Astro post in draft mode', () => {
  const queue = transitionSeed(
    sampleQueue(),
    'the-better-trap',
    'approved-for-research',
  );

  const prompt = renderDraftPrompt(queue, 'the-better-trap');

  assert.match(prompt, /src\/content\/blog\/the-better-trap\.md/);
  assert.match(prompt, /draft:\s*true/);
  assert.match(prompt, /status to `draft-review`/i);
});

test('parseFrontmatter reads simple Astro blog metadata', () => {
  const parsed = parseFrontmatter(`---
title: Test Post
description: Example
pubDate: 2026-03-14
tags: ['ai']
draft: true
---

Hello world.
`);

  assert.equal(parsed.title, 'Test Post');
  assert.equal(parsed.draft, true);
  assert.equal(parsed.pubDate, '2026-03-14');
});

test('findSeed rejects title-only lookup', () => {
  assert.throws(
    () => findSeed(sampleQueue(), 'The Better Trap'),
    /id "The Better Trap".*`id` value/i,
  );
});

test('findSeed matches ids even when another title collides with that id', () => {
  const queue = createQueue([
    {
      id: 'seed-a',
      title: 'shared-id',
      status: 'idea-review',
      angle: 'A',
      researchPath: 'content-ops/research/seed-a.md',
      draftPath: 'src/content/blog/seed-a.md',
    },
    {
      id: 'shared-id',
      title: 'Different Title',
      status: 'idea-review',
      angle: 'B',
      researchPath: 'content-ops/research/shared-id.md',
      draftPath: 'src/content/blog/shared-id.md',
    },
  ]);

  const seed = findSeed(queue, 'shared-id');

  assert.equal(seed.id, 'shared-id');
  assert.equal(seed.title, 'Different Title');
});

test('validatePublishSeed rejects drafts that are not approved for publish', () => {
  const queue = transitionSeed(
    transitionSeed(sampleQueue(), 'the-better-trap', 'approved-for-research'),
    'the-better-trap',
    'draft-review',
  );

  const result = validatePublishSeed({
    queue,
    seedId: 'the-better-trap',
    draftSource: `---
title: The Better Trap
description: Example
pubDate: 2026-03-14
tags: ['ai']
draft: true
---
`,
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /approved-for-publish/);
});

test('validatePublishSeed accepts a ready draft and preserves manual release', () => {
  const queue = transitionSeed(
    transitionSeed(
      transitionSeed(sampleQueue(), 'the-better-trap', 'approved-for-research'),
      'the-better-trap',
      'draft-review',
    ),
    'the-better-trap',
    'approved-for-publish',
  );

  const result = validatePublishSeed({
    queue,
    seedId: 'the-better-trap',
    draftSource: `---
title: The Better Trap
description: Example
pubDate: 2026-03-14
tags: ['ai']
draft: true
---
`,
  });

  assert.deepEqual(result, {
    ok: true,
    errors: [],
    warnings: ['Release is still manual: flip `draft` to `false`, then commit and push.'],
  });
});

test('validatePublishSeed fails clearly on unsupported multiline frontmatter', () => {
  const queue = transitionSeed(
    transitionSeed(
      transitionSeed(sampleQueue(), 'the-better-trap', 'approved-for-research'),
      'the-better-trap',
      'draft-review',
    ),
    'the-better-trap',
    'approved-for-publish',
  );

  const result = validatePublishSeed({
    queue,
    seedId: 'the-better-trap',
    draftSource: `---
title: The Better Trap
description: |
  Line one
  Line two
pubDate: 2026-03-14
tags: ['ai']
draft: true
---
`,
  });

  assert.equal(result.ok, false);
  assert.match(
    result.errors.join('\n'),
    /unsupported multiline frontmatter syntax/i,
  );
});

test('prepare-blog-publish reports workflow state before missing draft file errors', async () => {
  await assert.rejects(
    execFile('node', ['scripts/prepare-blog-publish.mjs', 'the-better-trap'], {
      cwd: repoRoot,
    }),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /approved-for-publish/);
      assert.doesNotMatch(error.stderr, /ENOENT/);
      return true;
    },
  );
});
