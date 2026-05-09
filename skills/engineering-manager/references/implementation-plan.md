# Implementation Plan

Use this reference after product intent is clear and before code changes start.

## Procedure

1. Inspect the repo structure, entrypoints, configs, schemas, tests, and local conventions.
2. Identify the minimum implementation slice.
3. Define boundaries: modules, ownership, interfaces, data contracts, and side effects.
4. List task sequence with verification after each meaningful step.
5. Name risks and gates for migrations, security, data loss, compatibility, performance, and rollout.
6. Produce downstream handoffs for implementation and QA.

## Risk Tiers

| Tier | Use When | Required Discipline |
|---|---|---|
| T0 Critical | Irreversible operations, auth/authz, secrets, concurrency, external contracts, sensitive data, money movement. | Test-first plan, security review, rollback or recovery notes, post-change verification. |
| T1 High | Schema migration, breaking API, multi-service coordination, production data transformation. | Explicit compatibility, migration, observability, and regression strategy. |
| T2 Medium | Local feature, contained API addition, moderate UI flow, single-service behavior. | Focused tests and clear acceptance checks. |
| T3 Low | Docs, config, small tooling, isolated copy or style change. | Sanity check only. |

## Plan Rules

- The implementer should not need to decide architecture, public interfaces, or test strategy.
- Avoid file-by-file inventories unless needed to prevent mistakes.
- Prefer reversible changes and clear rollback points.
- For broad features, require user approval before backend or frontend implementation.
- Block handoff when a critical failure mode has no handling and no test.
- For parallel work, name lanes, owned files or modules, dependencies, and merge-conflict risks.

## Output

```markdown
# Implementation Plan

Summary:

Architecture:

Interfaces:

Data Flow:

Risk Tier:

Task Sequence:

Tests:

Risks And Gates:

Rollout And Rollback:

Downstream Handoffs:
```
