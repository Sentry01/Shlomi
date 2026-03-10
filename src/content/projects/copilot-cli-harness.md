---
title: 'Copilot CLI Harness'
description: 'A persistent test-driven harness that wraps Copilot CLI in a memory-preserving loop — enabling autonomous multi-session builds with 350+ failing tests over 9+ hours.'
repo: 'https://github.com/Sentry01/Copilot-CLI-Harness'
liveUrl: 'https://harness-marketing-site.vercel.app/#hero'
heroImage: '/images/projects/copilot-cli-harness-diagram.png'
tags: ['ai', 'copilot', 'tdd', 'autonomous', 'cli', 'testing']
sortOrder: 2
---

AI coding assistants start strong, then hit a wall. They forget context mid-project, rewrite files they already created, declare victory when the app is half-built, and treat every new session like groundhog day. CopilotHarness was built to solve exactly this problem.

The harness wraps Copilot CLI in a persistent loop with memory: it reads a project specification, generates a comprehensive feature checklist (150+ test cases in a typical run), then iterates through a **Plan → Code → Verify → Repeat** cycle until every test passes. Between sessions, progress is persisted — the harness picks up exactly where it left off. GitHub integration is built in: it creates a dedicated repository and an Epic tracking issue at initialization, then updates the issue with progress after each session, providing a complete audit trail of the autonomous development process.

The longest continuous run to date lasted over 9 hours, driving Copilot CLI through 350+ functional failing tests across multiple sessions without manual intervention. TDD is the forcing function — every feature has a concrete pass/fail gate, which dramatically reduces hallucination and keeps the agent honest. The harness uses Playwright for browser-based UI verification and standard test runners for backend validation.

This project demonstrates that agentic coding becomes substantially more reliable when you give the agent structure (a test suite), memory (persistent state), and accountability (automated verification). The gap between "AI-assisted" and "AI-autonomous" coding isn't model capability — it's scaffolding.
