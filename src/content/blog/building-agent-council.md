---
title: 'Why One Model Isn''t Enough: Building Agent Council'
description: 'Single-model answers sound confident even when wrong. Agent Council throws three models at every hard question — collaboratively or adversarially — then synthesizes the result. Here is how and why I built it.'
pubDate: 2026-01-01
tags: ['ai', 'copilot', 'agents', 'multi-model', 'architecture']
draft: false
---

## The confidence problem

Ask Claude a hard architecture question and you get a thoughtful, well-structured answer. Ask GPT the same question and you get a different thoughtful, well-structured answer. Both will sound completely confident. Both will have blind spots the other one catches.

I noticed this pattern repeatedly while using Copilot CLI for architecture decisions, security reviews, and research tasks. Each model has genuine strengths — Claude tends toward nuanced reasoning, GPT toward breadth and practical grounding, Gemini toward strong factual anchoring — but none of them will tell you what they missed. Worse, none of them will try to break their own argument.

That observation is what led to Agent Council: a Copilot CLI extension that throws three different models at your problem in parallel, has them interact with each other's output, and then delivers a single synthesized result that no individual model could produce.

## Two modes, one insight

The key design decision was recognizing that different problems need different interaction patterns. Sometimes you want ideas to cross-pollinate. Sometimes you want ideas to fight.

**Collaborative mode** runs three agents — Alpha (deep explorer), Beta (practical builder), Gamma (elegant minimalist) — in parallel on the same prompt. After the first round, each agent reads the other two drafts and writes an improved version, stealing the best ideas. An orchestrator then synthesizes the three enriched perspectives into a final answer.

**Adversarial mode** runs the same three-agent first round, but then the orchestrator picks the strongest position. The other two agents attack it — looking for logical flaws, missed edge cases, unsupported claims. The orchestrator delivers a verdict: did the leading position survive scrutiny, need modification, or get overturned?

```
# Collaborative — brainstorming an architecture
council: Design a notification system that scales to 1M users.
         Push, pull, fan-out strategies.

# Adversarial — stress-testing a decision
debate: WebSockets + Redis pub/sub vs SSE + message queue
        for 10K concurrent users. Cost, complexity, failure modes.
```

Mode detection is automatic. Words like "brainstorm," "explore," and "ideas" trigger collaborative mode. Words like "debate," "stress-test," and "versus" trigger adversarial. You can override explicitly with `collaborative council:` or `adversarial council:`.

## The architecture is embarrassingly simple

Agent Council is zero-dependency. No build step. No runtime. No API keys beyond what Copilot CLI already provides. The entire system is a pair of markdown files — a skill definition and an agent definition — that Copilot CLI reads natively.

```bash
# Install: copy two markdown files
mkdir -p ~/.copilot/skills/agent-council
cp skills/agent-council/skill.md ~/.copilot/skills/agent-council/skill.md
mkdir -p ~/.copilot/agents
cp agents/AgentCouncil.agent.md ~/.copilot/agents/AgentCouncil.agent.md
```

The skill file contains the dispatch logic: which models to assign to each role, how to structure the prompts for each phase, and the rules for mode detection. The agent file makes it available as a standalone `copilot --agent AgentCouncil` command. Each model is assigned a codename and a role that shifts depending on the mode:

| Agent | Collaborative Role | Adversarial Role | Default Model |
|-------|-------------------|-----------------|---------------|
| Alpha | Deep Explorer | Drafter & Red Teamer | Claude |
| Beta | Practical Builder | Fact-Checker | GPT |
| Gamma | Elegant Minimalist | Devil's Advocate | Gemini |
| Orchestrator | Author | Judge | Claude |

The cost profile is predictable: collaborative mode uses 7 subagent calls (3 draft + 3 improve + 1 orchestrate), adversarial uses 6 (3 draft + 2 attack + 1 verdict). Both modes run agents in parallel within each phase, so wall-clock time is roughly two sequential calls regardless of how many agents participate.

## What I learned shipping this

**Model diversity matters more than model quality.** Swapping all three agents to the same model family — even the best one — produces noticeably worse results than using three different families. The value is not in any individual model's capability; it is in the orthogonal failure modes.

**Adversarial mode changes how you think about AI answers.** When you see a position survive two dedicated attack rounds, you trust it differently than when a single model tells you "this is the best approach." The verdict format — SURVIVED, MODIFIED, or OVERTURNED — forces a binary signal that is more honest than a hedged paragraph.

**The "verbose" mode is a teaching tool.** Adding `verbose` before any prompt shows the full internal deliberation: each agent's draft, the cross-pollination or attack rounds, and the orchestrator's reasoning. I have found this more useful for understanding model behavior than any benchmark.

## When to use each mode — and when to skip both

Collaborative mode earns its cost on creative problems where you want breadth: architecture brainstorming, research synthesis, exploring a design space with no obvious right answer.

Adversarial mode earns its cost on consequential decisions: architecture choices you will live with for years, security reviews where missed vulnerabilities are expensive, A-versus-B comparisons where you need confidence the winner actually holds up.

Neither mode is worth it for quick lookups, simple code generation, or anything where speed matters more than correctness. A single model is fine for most daily tasks. The council is for the 5% of questions where being wrong is costly.

## The bigger picture

Agent Council is one piece of a broader thesis: that the next leap in AI-assisted development is not better models — it is better orchestration. Single-model tools will keep improving, but the compound gains from structured multi-model interaction, persistent memory, and automated verification are multiplicative.

The same pattern shows up in [CopilotHarness](../../projects/copilot-cli-harness/) (TDD as a forcing function for agent reliability) and [Fleet Mode](../../projects/fleet-agent-swarm/) (parallel agent swarms for task execution). Different problems, same underlying insight: AI agents get dramatically better when you give them structure, accountability, and — in the council's case — intellectual competition.

The code is [open source](https://github.com/Sentry01/AgentCouncil) and MIT licensed. Inspired by Andrej Karpathy's [llm-council](https://github.com/karpathy/llm-council), adapted for the Copilot CLI agent architecture.
