---
title: 'Copilot SDK Multi-User Chat'
description: 'A demo application using the Copilot SDK in Node.js that enables multi-user chat controlling a CLI agent running in Docker for collaborative coding sessions.'
tags: ['copilot', 'sdk', 'node', 'docker', 'collaborative', 'demo']
sortOrder: 6
---

Most AI coding tools are designed for a single developer sitting in front of a single editor. This demo explores what collaborative AI-assisted development looks like when multiple users share a session — chatting with each other and jointly directing a Copilot-powered CLI agent that runs inside a Docker container.

Built with the Copilot SDK in Node.js, the application provides a multi-user chat interface where participants can observe and contribute to an ongoing agentic coding session. The CLI agent runs in an isolated Docker environment, executing code changes and running tests in a sandboxed container. Chat messages, agent actions, and code diffs flow through a shared context, so every participant sees what the agent is doing and can steer it.

The project was built as a demonstration of the Copilot SDK's extensibility — showing how the platform APIs can support workflows beyond the traditional single-user, single-editor paradigm. It hints at a future where code review, pair programming, and agentic development converge into a single collaborative surface.
