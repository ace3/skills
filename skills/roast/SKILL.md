---
name: roast
description: >
  Relentlessly interview and stress-test the user about a plan, spec, PRD,
  AGENT_SPEC.md, architecture, or design one question at a time. Use when the
  user says "roast me", asks to be roasted on a plan, wants to stress-test,
  refine, finalize, talk through, or walk down the design tree, or asks what
  questions remain. Upgrade to docs-aware roasting when existing domain docs,
  CONTEXT.md, ADRs, or codebase terminology should constrain the discussion.
---

# Roast

Use this skill to pressure-test a plan until the user and agent share a precise understanding. Be direct, technical, and useful. Do not perform casual banter.

## Core Protocol

1. Read the full plan, spec, PRD, architecture doc, or structured design first.
2. If a codebase is available or referenced, inspect it before asking questions the repo can answer.
3. Build an internal decision map ordered by dependency: resolved decisions, open questions, and blocked questions.
4. Ask exactly one question per turn. Pick the most dependency-blocking question.
5. Provide a concrete recommended answer with every question.
6. Wait for the user's answer before asking the next question.
7. If the user says "you decide" or equivalent, make the decision, state it clearly, and continue.
8. If the user says "done" or "that's enough", stop and offer a synthesis.

## Codebase-First Rule

Never ask what can be answered by reading files, configs, tests, schemas, docs, or existing code patterns.

Say: "Let me check the codebase for that..." Then inspect the relevant files, summarize what you found, and continue with the next unresolved question.

## Roast Tree

Adapt the order to the actual plan. Cover only branches that matter.

- Goal: primary job, success behavior, non-goals.
- Data model: schemas, ownership, migration, source of truth.
- Interfaces: API shape, inputs, outputs, errors, versioning.
- Architecture: boundaries, components, sync or async communication.
- State: persistence, consistency, caching, lifecycle.
- Security: authn, authz, sensitive data, abuse paths.
- Resilience: failure modes, retries, fallbacks, observability.
- Testing: unit, integration, e2e, fixtures, regression risks.
- Developer experience: local workflow, tooling, conventions.
- Rollout: phases, flags, rollback, verification.
- Explicit TODO/TBD/open items from the plan.

After the first pass, revisit decisions that were blocked by earlier answers.

## Docs-Aware Upgrade

Upgrade from basic roast to docs-aware roast when any of these are true:

- The user asks to use docs, upgrade the roast, or compare against existing project language.
- The plan depends on domain terminology, bounded contexts, ADRs, or long-lived architectural decisions.
- You find `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, or equivalent project decision docs.
- The user's stated model conflicts with code or docs.

When upgraded:

- Read `CONTEXT-MAP.md` first if present; otherwise look for root or context-local `CONTEXT.md`.
- Challenge terminology conflicts immediately.
- Sharpen vague terms into a proposed canonical term.
- Cross-check claims against code when feasible.
- Update `CONTEXT.md` inline only after a term is resolved and only with domain language meaningful to experts.
- Offer an ADR only when the decision is hard to reverse, surprising without context, and the result of a real trade-off.
- Create docs lazily. Do not create `CONTEXT.md` or `docs/adr/` until there is resolved content worth writing.

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
- Push back on contradictions or hidden complexity.
- Prefer the simplest design that satisfies the stated goal.
- Do not invent implementation work during the interview.
- Maintain the internal map continuously: resolved, open, blocked.
- When major branches are covered, offer to produce an updated spec, AGENT_SPEC.md, or architecture summary.
