# Blog Workflow

This repo now has a repo-native editorial queue for weekly blog drafting. The queue is visible in `content-ops/blog-seeds.json`, research packets belong in `content-ops/research/`, and Astro draft posts belong in `src/content/blog/` with `draft: true` until release is explicitly approved.

## Review points

- **Seed review:** `content-ops/blog-seeds.json`
- **Research review:** each seed's `researchPath` under `content-ops/research/`
- **Draft review:** each seed's `draftPath` under `src/content/blog/`
- **Release prep:** run `node scripts/prepare-blog-publish.mjs <seed-id>` before any draft is released

## Status flow

The queue uses these explicit statuses:

1. `idea-review` — seed is visible for review, no generation yet
2. `approved-for-research` — approval gate 1 passed; research and draft work may start
3. `draft-review` — research exists and the blog draft is ready for human review
4. `approved-for-publish` — approval gate 2 passed; release prep may begin
5. `published` — the post was released by setting `draft: false` and shipping it normally

There is **no automatic publishing** in this workflow. Production still depends on the existing Astro behavior: a post appears only after `draft: false` is committed and pushed to `main`.

## Helper scripts

- `node scripts/blog-ops.mjs list` — show the full queue
- `node scripts/blog-ops.mjs list --ready-only` — show actionable items only
- `node scripts/blog-ops.mjs show <seed-id>` — inspect one queue item
- `node scripts/blog-ops.mjs approve-research <seed-id>` — move `idea-review` → `approved-for-research`
- `node scripts/blog-ops.mjs mark-draft-review <seed-id>` — move `approved-for-research` → `draft-review`
- `node scripts/blog-ops.mjs approve-publish <seed-id>` — move `draft-review` → `approved-for-publish`
- `node scripts/blog-ops.mjs mark-published <seed-id>` — move `approved-for-publish` → `published`
- `node scripts/blog-research-prompt.mjs <seed-id>` — print a ready-to-use research prompt
- `node scripts/blog-draft-prompt.mjs <seed-id>` — print a ready-to-use draft prompt
- `node scripts/prepare-blog-publish.mjs <seed-id>` — validate queue status and draft frontmatter before release

The queue file is canonical. You can edit it directly in VS Code, or use `scripts/blog-ops.mjs` for safe status transitions.
All helper scripts and commands accept only the queue item's `id` value from `content-ops/blog-seeds.json`. Titles are for humans and are not valid lookup keys.

## Exact prompt phrases for later

Use these exact phrases with the assistant when you are ready:

### Review the queue

> Review the editorial queue in `content-ops/blog-seeds.json` and summarize each seed by status, angle, and next action.

### Approve a seed for research

> Approve the seed `the-better-trap` for research by updating `content-ops/blog-seeds.json` from `idea-review` to `approved-for-research`.

### Start research + draft build

> Start research + draft build for `the-better-trap`. Use `node scripts/blog-research-prompt.mjs the-better-trap` and `node scripts/blog-draft-prompt.mjs the-better-trap`, write the research packet to its `researchPath`, create the draft at its `draftPath` with `draft: true`, and then update the queue item to `draft-review`.

### Approve a draft for release

> Approve the draft `the-better-trap` for release by updating its queue item from `draft-review` to `approved-for-publish`.

### Release a draft to the site

> Release `the-better-trap` to the site. First run `node scripts/prepare-blog-publish.mjs the-better-trap`, then change the post frontmatter from `draft: true` to `draft: false`, update the queue item to `published`, and leave the repo ready for commit.

## Safe weekly automation example

The example launchd plist in `scripts/launchd/com.shlomi.weekly-blog-drafts.plist.example` is intentionally safe: it only logs the actionable queue items. It does **not** generate research, draft posts, commits, pushes, or releases.
