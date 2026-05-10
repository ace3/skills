# Roast Tree, Decomposition, and Context Upgrade

Procedural depth that only kicks in for larger plans or when project terminology must constrain the conversation. Load when the Core Protocol in `SKILL.md` is not enough.

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

## Large-Scope Decomposition

Use this when the plan, spec, or codebase is too large for one reliable pass: 10+ files, many independent subsystems, 50k+ tokens, scattered evidence, or repeated context loss risk.

1. Partition by decision area, subsystem, or evidence source.
2. Review one partition at a time and keep a short map of resolved, open, and blocked points.
3. Ask only the most blocking cross-partition question.
4. Re-check final conclusions against the smaller partition notes before synthesizing.
5. If a partition is independent enough to be its own spec, say so and recommend splitting the work.

## Context Upgrade

Upgrade when any of these are true:

- The user asks to use docs or compare against project language.
- The plan depends on domain terminology, bounded contexts, ADRs, or durable architecture.
- You find `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`, or equivalent decision docs.
- The user's model conflicts with code or docs.

When upgraded:

- Read `CONTEXT-MAP.md` first if present, otherwise find `CONTEXT.md`.
- Challenge terminology conflicts and propose canonical terms.
- Cross-check code when feasible.
- Update `CONTEXT.md` only after a term is resolved.
- Offer ADRs only for hard-to-reverse trade-offs.
