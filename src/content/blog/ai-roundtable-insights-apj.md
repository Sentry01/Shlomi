---
title: 'What Enterprise Leaders Actually Ask About AI Coding: Patterns from APJ Roundtables'
description: 'After running CIO roundtables across Hong Kong, Sydney, Singapore, and Bangkok, clear patterns emerged in how enterprise leaders think about AI-assisted development. Here is what they ask — and what it reveals.'
pubDate: 2026-03-07
tags: ['ai', 'enterprise', 'copilot', 'leadership', 'apj']
draft: false
---

## The room is different from the keynote stage

Keynotes are about vision. Roundtables are about reality. When you put 15 CIOs around a table in Hong Kong, Sydney, Singapore, or Bangkok and ask them about AI coding, the conversation is nothing like the conference-stage version. There is no applause line. There is no polished demo. There is a room full of people who are responsible for thousands of developers and millions of lines of production code, and they want to know what is actually going to happen to their organizations.

Over the past year, I have had the privilege of facilitating these conversations across the Asia Pacific region. The specific questions vary by market, but the underlying patterns are remarkably consistent. Here is what enterprise technology leaders are actually asking — and what those questions reveal about the state of AI adoption in large organizations.

## Pattern 1: "How do we measure this?"

The most common question is not "should we adopt AI coding tools?" — that debate is largely settled. The question is how to measure the impact once you do. And it is a harder question than it sounds.

Velocity metrics (lines of code, PRs merged, cycle time) are the first instinct, but experienced leaders know they are gameable and do not map cleanly to business outcomes. The more sophisticated conversations center on:

- **Developer satisfaction and retention.** Does AI tooling make the job better? Are developers choosing to work at organizations that provide these tools?
- **Time-to-value for new features.** Not "how fast can we ship code" but "how fast can we ship working, tested, secure code that customers use."
- **Defect density and remediation time.** Does AI-assisted code introduce more bugs? Fewer? Different kinds?
- **Security posture.** What happens to vulnerability counts, mean time to remediation, and secret leak rates when AI is writing a significant portion of the code?

One CTO in Sydney framed it well: "I can show the board a 40% improvement in PR throughput, but if our security incidents go up 20%, we have not actually gained anything." The measurement framework has to be holistic.

## Pattern 2: "What about governance?"

This is where the "vibe coding" conversation gets real. Enterprise leaders understand that AI-assisted development amplifies both productivity and risk. The developers writing code faster are also potentially introducing vulnerabilities faster, hardcoding secrets faster, and creating technical debt faster.

The governance questions cluster around three areas:

**Code provenance.** Who is responsible for AI-generated code? If Copilot suggests a function that contains a security vulnerability, is that the developer's responsibility? The team lead's? The CISO's? Most organizations have not updated their accountability frameworks for AI-assisted workflows.

**Compliance and audit.** Regulated industries (banking, healthcare, government) need to demonstrate that their software development process meets specific standards. Where does AI fit in the audit trail? Some organizations are requiring that AI-generated code be flagged in commit messages or PR descriptions. Others are treating it the same as any other code — subject to the same review and testing requirements.

**Intellectual property.** Concerns about training data, code similarity, and licensing implications come up in nearly every roundtable. The legal landscape is still evolving, and CIOs want practical guidance, not theoretical frameworks.

```yaml
# A pattern I have seen work well for governance:
# Treat AI-assisted code exactly like human code --
# same review requirements, same test coverage,
# same security scanning -- but add visibility.

# .github/copilot-governance.yml
code_review:
  ai_assisted_prs: require_human_review
  coverage_threshold: 80%
  security_scan: required
  provenance_label: auto  # Tag AI-assisted commits
```

## Pattern 3: "How do we scale without losing control?"

The pilot-to-scale transition is where most organizations struggle. A 50-person pilot with enthusiastic early adopters is easy. Rolling Copilot out to 5,000 developers across 12 time zones, 4 business units, and 3 regulatory frameworks is a different problem entirely.

The scaling challenges I hear most often:

- **Skill variance.** Senior developers use AI tools effectively as a force multiplier. Junior developers sometimes use them as a crutch that masks gaps in understanding. The training and enablement strategy has to account for this.
- **Policy consistency.** Different teams adopt different practices — some embrace AI-generated tests, others ban them. Without organization-wide policy, you get a patchwork that is impossible to audit.
- **Cost management.** At scale, AI tooling costs are material. Leaders want usage analytics, per-team cost allocation, and evidence that the spend is justified by productivity gains.

The organizations that scale successfully tend to invest in platform engineering — building paved paths that embed security, compliance, and AI governance into the developer workflow so that doing the right thing is the easy thing.

## Pattern 4: "What is actually different in our market?"

APJ is not a monologue. Hong Kong, Sydney, Singapore, and Bangkok each have distinct characteristics that shape AI adoption:

**Hong Kong and Singapore** tend to lead on financial services adoption, where regulatory requirements are stringent but the competitive pressure to automate is intense. The conversations here are sophisticated — these leaders have already done pilots and are wrestling with scale.

**Sydney** has a strong enterprise technology community with deep ties to both US and UK practices. The governance conversation is advanced, partly because Australian privacy and data sovereignty requirements force early thinking about where AI processing happens.

**Bangkok** is at an earlier but rapidly accelerating stage. The questions are more foundational — "how do we get started?" and "how do we build the internal capability to evaluate these tools?" — but the energy and ambition are unmistakable.

In every market, the consistent thread is that leaders want peer evidence. Not vendor case studies — real conversations with other CIOs who have deployed at scale and can speak honestly about what worked and what did not.

## What the questions reveal

The meta-pattern across all four roundtables is a shift from "should we?" to "how do we do this responsibly at scale?" This is a maturity signal. The hype phase — where AI coding was either going to replace all developers or was a passing fad — is behind us for enterprise leaders. The pragmatic phase — where the hard work of governance, measurement, training, and cultural change happens — is where we are now.

The organizations that will win this transition are the ones that treat AI-assisted development as a capability to be governed, not a product to be purchased. The tooling matters, but the organizational scaffolding around it matters more.

I am looking forward to the next round of conversations. The questions are getting sharper, and the answers are getting more honest. That is how progress actually happens in enterprise technology — not in keynotes, but in rooms where leaders can ask the uncomfortable questions and share what they have actually learned.
