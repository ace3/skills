---
name: roast
description: >
  One-question-at-a-time plan, spec, PRD, AGENT_SPEC.md, architecture, or
  design stress test. Use when the user says "roast me", asks to stress-test,
  refine, finalize, talk through, walk down a design tree, or identify remaining
  questions. Upgrade when domain docs, CONTEXT.md, ADRs, or code terminology
  should constrain the discussion.
---

# Roast

Pressure-test a plan until the user and agent share a precise understanding. Be direct, technical, and useful.

## Core Protocol

1. Read the full plan, spec, PRD, architecture doc, or design first.
2. Inspect available code/docs before asking anything the repo can answer.
3. Maintain an internal dependency map: resolved, open, blocked.
4. Ask exactly one question per turn, choosing the most blocking one.
5. Include a concrete recommended answer with every question.
6. Wait for the answer before continuing.
7. If the user says "you decide", decide, state it, and continue.
8. If the user says "done", stop and offer a synthesis.

## Roast Tree

Adapt the order to the plan. Cover only branches that matter.

- Goal: job, success behavior, non-goals
- Data: schema, ownership, migration, source of truth
- Interfaces: APIs, inputs, outputs, errors, versioning
- Architecture/state: boundaries, components, communication, persistence, consistency
- Security/resilience: auth, sensitive data, abuse paths, failures, retries, observability
- Testing/devex/rollout: regressions, workflow, tooling, phases, flags, rollback, verification
- Explicit TODO/TBD/open items from the plan.

After the first pass, revisit decisions that were blocked by earlier answers.

Upgrade when any of these are true:

- The user asks to use docs or compare against project language.
- The plan depends on domain terminology, bounded contexts, ADRs, or durable architecture.
- You find `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, or equivalent decision docs.
- The user's model conflicts with code or docs.

When upgraded, read `CONTEXT-MAP.md` first if present, otherwise find `CONTEXT.md`; challenge terminology conflicts, propose canonical terms, cross-check code when feasible, update `CONTEXT.md` only after a term is resolved, and offer ADRs only for hard-to-reverse trade-offs.

## Question Format

Use this exact shape:

```markdown
**[Area]: [Short question title]**

[One or two sentences explaining why this decision matters now.]

Question: [The single question.]

My recommendation: [Concrete recommendation with brief rationale]. Does that match your intent, or would you change anything?
```

## Rules

- One question per turn, no bundled questions.
- Recommendations must be concrete and opinionated.
- Push back on contradictions and hidden complexity.
- Prefer the simplest design that satisfies the goal.
- Do not invent implementation work during the interview.
- Maintain the internal map continuously: resolved, open, blocked.
- When major branches are covered, offer to produce an updated spec, AGENT_SPEC.md, or architecture summary.
