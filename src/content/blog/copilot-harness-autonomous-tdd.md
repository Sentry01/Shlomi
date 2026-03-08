---
title: 'Nine Hours, 350 Tests, Zero Babysitting: Autonomous TDD with Copilot CLI'
description: 'AI coding assistants forget context, declare victory early, and lose progress between sessions. CopilotHarness fixes this with persistent TDD loops that ran autonomously for 9+ hours across 350+ tests.'
pubDate: 2026-03-07
tags: ['ai', 'copilot', 'tdd', 'autonomous', 'testing', 'agent']
draft: false
---

## The babysitting problem

Every developer who has used an AI coding assistant for more than a trivial task has hit the same wall. You ask it to build something substantial. It starts strong — scaffolds files, writes plausible code, makes real progress. Then session two starts and it rewrites everything from scratch. Session three: "What login? I don't see any auth code."

The root cause is not model capability. Modern LLMs can write good code. The problem is structural:

- **Context loss between sessions.** Every restart is groundhog day.
- **No verification loop.** The model declares "done" with no way to prove it.
- **No memory of what worked.** Progress evaporates at the session boundary.

I built CopilotHarness to fix all three — and the results surprised me. The longest autonomous run went over 9 hours, driving Copilot CLI through 350+ failing functional tests across multiple sessions, without manual intervention.

## TDD as a forcing function

The core insight behind the harness is that test-driven development is not just a software practice — it is the best constraint you can impose on an AI coding agent. A failing test is an unambiguous goal. A passing test is an unambiguous signal of progress. No hallucination survives a real assertion.

The harness implements a simple loop:

```
Plan -> Code -> Verify -> Repeat
```

In practice, this means:

1. **Initialization:** The harness reads an `app_spec.txt`, creates a dedicated GitHub repository and tracking issue, and generates a `feature_list.json` — typically 150+ test cases covering core features, UI states, and edge cases.
2. **Pick:** It selects the highest-priority failing test.
3. **Code:** It spins up a Copilot CLI session to implement that specific feature.
4. **Verify:** It runs the test (Playwright for UI, standard test runners for backend).
5. **Update:** It records the result, persists state, and moves to the next failing test.

Between sessions, the harness serializes progress to disk. When the next session starts, it picks up exactly where it left off — same feature list, same pass/fail state, same implementation context.

```
# Session 1: Harness initializes
  Created GitHub repo: my_todo_app
  Generated 156 test cases from spec
  Feature 1/156: Project scaffold... VERIFIED

# Session 12: Still grinding
  Feature 89/156: Drag-and-drop reorder... VERIFIED
  Progress saved. Resuming from feature 90...

# Session 23: Finished
  All 156 features passing
  Updated GitHub issue with completion summary
```

## GitHub as the audit trail

One design decision that paid off unexpectedly: the harness creates a GitHub Issue at initialization and updates it after every session with completed features, remaining work, and any errors. This turns the issue into a complete audit trail of the autonomous development process.

This matters for more than recordkeeping. When the harness encounters a stubborn failure — say, a CSS layout test that the model keeps getting wrong — the issue history shows exactly what was attempted and how many times. That history is useful context for debugging, and it is useful evidence for understanding where current models consistently fail.

```python
# Simplified: the verify-and-update loop
def run_session(harness):
    feature = harness.get_next_failing_test()
    while feature:
        result = copilot_cli.implement(feature)
        verified = harness.verify(feature, result)
        harness.update_progress(feature, verified)
        harness.update_github_issue()
        if verified:
            feature = harness.get_next_failing_test()
        else:
            harness.log_failure(feature, result)
            feature = harness.get_next_failing_test()
```

## What 9 hours of autonomous coding taught me

The 9-hour run was not a stunt. It was the natural consequence of having 350+ tests to pass and a model that could handle most of them without intervention. Several observations emerged:

**Early tests pass fast; late tests pass slow.** The first 50 features — scaffolding, basic CRUD, simple UI — flew by. The last 50 — edge cases, error handling, complex state interactions — sometimes took multiple attempts per feature. This mirrors human development patterns, but the ratio is more extreme with AI.

**TDD catches hallucination in real time.** Without tests, Copilot occasionally generates code that looks correct but does not work. The gap between "looks correct" and "passes a test" is where hallucination lives. The harness closes that gap on every single feature.

**Context persistence changes the game.** The harness does not just remember what tests passed — it remembers the code that was generated, the file structure that exists, and the patterns that were established in earlier sessions. When session 15 needs to add a feature that touches code from session 3, the context is there. Without this, the model would reinvent the architecture every session.

**The model needs constraints, not freedom.** Giving Copilot CLI a blank canvas and saying "build an app" produces impressive-looking but fragile code. Giving it a specific failing test and saying "make this pass" produces code that actually works. The narrower the goal, the more reliable the output.

## The gap is not model capability — it is scaffolding

The meta-lesson from this project is that the distance between "AI-assisted coding" and "AI-autonomous coding" is not about smarter models. It is about the scaffolding around the model:

- **Structure:** A test suite gives the agent clear goals and success criteria.
- **Memory:** Persistent state eliminates the context-loss problem.
- **Accountability:** Automated verification catches failures before they compound.
- **Audit:** The GitHub Issue trail provides transparency and debuggability.

Each of these is a solved problem in traditional software engineering. The contribution of the harness is applying them to the agent workflow itself — treating the AI not as an oracle but as a junior developer who needs guardrails, test suites, and progress tracking.

## What is next

The harness currently targets Copilot CLI, but the pattern is model-agnostic. Any agent that can read a prompt, write code, and run in a session could be wrapped in the same Plan, Code, Verify, Repeat loop. The interesting frontier is combining this persistence pattern with multi-agent orchestration — running a [council](../../projects/agent-council/) of models inside the harness loop for the hard tests, and a single fast model for the easy ones.

The code is [open source on GitHub](https://github.com/Sentry01/Copilot-CLI-Harness). If you have been frustrated by AI coding tools that forget what they did yesterday, this is the fix.
