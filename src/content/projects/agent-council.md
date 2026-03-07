---
title: 'Agent Council'
description: 'A Copilot CLI extension that throws three different AI models at your problem in parallel — collaboratively or adversarially — then synthesizes a single, battle-tested answer.'
repo: 'https://github.com/Sentry01/AgentCouncil'
tags: ['ai', 'copilot', 'agents', 'multi-model', 'cli']
sortOrder: 1
---

Ask one model a question and you get one perspective. It sounds confident even when it's wrong. It won't question its own assumptions. It definitely won't try to break its own argument.

Agent Council changes that equation. It's a skill and agent for [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/) that launches three subagents — each backed by a different model family (Claude, GPT, Gemini) — to work on the same problem in parallel. The models don't just run independently; they read each other's output and either build on it or attack it, depending on the mode you choose.

**Collaborative mode** has each agent explore from a different angle, cross-pollinate ideas, and then an orchestrator writes a synthesis that none of them could have produced alone. **Adversarial mode** picks the strongest position and lets the other two try to tear it apart — the orchestrator then delivers a verdict: survived, modified, or overturned. Mode detection is automatic based on your phrasing, or you can override it explicitly.

The entire system is zero-dependency — just markdown files that Copilot CLI reads. No build step, no runtime, no API keys to manage beyond what Copilot already provides. Inspired by Andrej Karpathy's [llm-council](https://github.com/karpathy/llm-council), adapted for the Copilot CLI agent architecture with the dual-mode design. The collaborative path uses 7 subagent calls across 2 parallel rounds; adversarial uses 6. Wall-clock time is roughly two sequential calls regardless of agent count.
