import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const STATUSES = [
  'idea-review',
  'approved-for-research',
  'draft-review',
  'approved-for-publish',
  'published',
];

const ALLOWED_TRANSITIONS = {
  'idea-review': ['approved-for-research'],
  'approved-for-research': ['draft-review'],
  'draft-review': ['approved-for-publish'],
  'approved-for-publish': ['published'],
  published: [],
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(scriptDir, '..');
export const DEFAULT_QUEUE_PATH = path.join(
  REPO_ROOT,
  'content-ops',
  'blog-seeds.json',
);

export function createQueue(items, overrides = {}) {
  return {
    version: 1,
    updatedAt: overrides.updatedAt ?? null,
    statuses: [...STATUSES],
    items: items.map((item) => ({
      approvedForResearchAt: null,
      draftReadyAt: null,
      approvedForPublishAt: null,
      publishedAt: null,
      notes: '',
      ...item,
    })),
  };
}

export function validateSeedQueue(queue) {
  const errors = [];

  if (!queue || typeof queue !== 'object') {
    throw new Error('Queue must be an object.');
  }

  if (queue.version !== 1) {
    errors.push('Queue version must be 1.');
  }

  if (JSON.stringify(queue.statuses) !== JSON.stringify(STATUSES)) {
    errors.push('Queue statuses must match the supported editorial workflow.');
  }

  if (!Array.isArray(queue.items) || queue.items.length === 0) {
    errors.push('Queue must include at least one seed item.');
  }

  const seenIds = new Set();

  for (const item of queue.items ?? []) {
    if (!item.id || !/^[a-z0-9-]+$/.test(item.id)) {
      errors.push(`Seed id "${item.id}" must be kebab-case.`);
    }
    if (seenIds.has(item.id)) {
      errors.push(`Seed id "${item.id}" must be unique.`);
    }
    seenIds.add(item.id);

    if (!item.title) {
      errors.push(`Seed "${item.id}" is missing a title.`);
    }
    if (!STATUSES.includes(item.status)) {
      errors.push(`Seed "${item.id}" has unsupported status "${item.status}".`);
    }
    if (!item.researchPath?.startsWith('content-ops/research/')) {
      errors.push(`Seed "${item.id}" researchPath must stay under content-ops/research/.`);
    }
    if (!item.researchPath?.endsWith('.md')) {
      errors.push(`Seed "${item.id}" researchPath must be a markdown file.`);
    }
    if (!item.draftPath?.startsWith('src/content/blog/')) {
      errors.push(`Seed "${item.id}" draftPath must stay under src/content/blog/.`);
    }
    if (!item.draftPath?.endsWith('.md')) {
      errors.push(`Seed "${item.id}" draftPath must point to a markdown file.`);
    }
    if (!item.angle) {
      errors.push(`Seed "${item.id}" is missing its one-line angle.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  return queue;
}

export async function loadSeedQueue(queuePath = DEFAULT_QUEUE_PATH) {
  const raw = await readFile(queuePath, 'utf8');
  return validateSeedQueue(JSON.parse(raw));
}

export async function saveSeedQueue(queue, queuePath = DEFAULT_QUEUE_PATH) {
  validateSeedQueue(queue);
  await writeFile(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
}

export function findSeed(queue, seedId) {
  validateSeedQueue(queue);

  const seed = queue.items.find((item) => item.id === seedId);

  if (!seed) {
    throw new Error(
      `Could not find a blog seed with id "${seedId}". Use the queue item's \`id\` value from content-ops/blog-seeds.json.`,
    );
  }

  return seed;
}

export function transitionSeed(queue, seedId, nextStatus, options = {}) {
  validateSeedQueue(queue);
  const seed = findSeed(queue, seedId);

  if (!STATUSES.includes(nextStatus)) {
    throw new Error(`Unsupported status "${nextStatus}".`);
  }

  if (!ALLOWED_TRANSITIONS[seed.status].includes(nextStatus)) {
    throw new Error(
      `Invalid status transition: ${seed.status} -> ${nextStatus}.`,
    );
  }

  const now = options.now ?? new Date().toISOString();
  const timestampField = {
    'approved-for-research': 'approvedForResearchAt',
    'draft-review': 'draftReadyAt',
    'approved-for-publish': 'approvedForPublishAt',
    published: 'publishedAt',
  }[nextStatus];

  return {
    ...queue,
    updatedAt: now,
    items: queue.items.map((item) =>
      item.id === seed.id
        ? {
            ...item,
            status: nextStatus,
            ...(timestampField ? { [timestampField]: now } : {}),
          }
        : item,
    ),
  };
}

function parseArray(value) {
  const inner = value.trim().slice(1, -1).trim();
  if (!inner) return [];

  return inner
    .split(',')
    .map((part) => part.trim())
    .map((part) => part.replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function parseScalar(value) {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return parseArray(trimmed);
  }

  return trimmed.replace(/^['"]|['"]$/g, '');
}

export function parseFrontmatter(source) {
  const normalizedSource = source.replace(/\r\n/g, '\n');
  const match = normalizedSource.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Could not find frontmatter block.');
  }

  const result = {};
  const lines = match[1].split('\n');

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\s*#/.test(line)) continue;
    if (/^\s/.test(line)) {
      throw new Error(
        `Unsupported multiline frontmatter syntax on line ${index + 1}. Use single-line scalar values for release preparation.`,
      );
    }

    const separator = line.indexOf(':');
    if (separator === -1) {
      throw new Error(
        `Unsupported frontmatter syntax on line ${index + 1}: "${trimmed}".`,
      );
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1);
    const trimmedValue = value.trim();

    if (/^[>|][0-9+-]*$/.test(trimmedValue)) {
      throw new Error(
        `Unsupported multiline frontmatter syntax for "${key}" on line ${index + 1}. Use a single-line scalar value for release preparation.`,
      );
    }

    result[key] = parseScalar(value);
  }

  return result;
}

export function validatePublishSeed({ queue, seedId, draftSource }) {
  const seed = findSeed(queue, seedId);
  const errors = [];

  if (seed.status !== 'approved-for-publish') {
    errors.push(
      `Seed "${seed.id}" must be approved-for-publish before release prep.`,
    );
  }

  let frontmatter;
  try {
    frontmatter = parseFrontmatter(draftSource);
  } catch (error) {
    errors.push(error.message);
  }

  if (frontmatter) {
    for (const field of ['title', 'description', 'pubDate', 'tags', 'draft']) {
      if (!(field in frontmatter)) {
        errors.push(`Draft frontmatter is missing "${field}".`);
      }
    }

    if (
      'tags' in frontmatter &&
      (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0)
    ) {
      errors.push('Draft frontmatter must include at least one tag.');
    }

    if (frontmatter.draft !== true) {
      errors.push(
        'Draft frontmatter must still be `draft: true` during release preparation.',
      );
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings: [] };
  }

  return {
    ok: true,
    errors: [],
    warnings: [
      'Release is still manual: flip `draft` to `false`, then commit and push.',
    ],
  };
}

export function formatQueue(queue, { readyOnly = false } = {}) {
  validateSeedQueue(queue);

  const actionable = new Set([
    'approved-for-research',
    'draft-review',
    'approved-for-publish',
  ]);

  const items = readyOnly
    ? queue.items.filter((item) => actionable.has(item.status))
    : queue.items;

  if (items.length === 0) {
    return 'No matching blog seeds.';
  }

  return items
    .map(
      (item) =>
        `- ${item.id} [${item.status}] ${item.title}\n  research: ${item.researchPath}\n  draft: ${item.draftPath}`,
    )
    .join('\n');
}
