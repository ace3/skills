# Product Brief

Use this reference to define what should be built before engineering design.

## Procedure

1. Inspect existing docs, issues, specs, UI, API behavior, support tickets, analytics, and current workflows.
2. Extract jobs, triggers, workarounds, pain, and representative user quotes when raw feedback exists.
3. Cluster themes by shared job and pain, not by requested feature.
4. Identify the primary user, trigger, desired outcome, and success metric.
5. Define the smallest release slice that creates value.
6. Write acceptance criteria as externally observable behavior.
7. Name non-goals to prevent silent scope growth.
8. Capture technical implications for engineering without choosing the implementation.

## Scope Rules

- Do not include future configuration, personalization, dashboards, notifications, or admin tools unless they are necessary for the first release.
- If the request contains multiple independent products, split it before writing a single PRD.
- Prefer a measurable workflow outcome over vague quality claims.
- A PRD without a problem hypothesis is not ready; ask for the missing user signal or label it as an assumption.
- If you ask choices, label them so the user can answer by index or letter.

## Technical Implications

Capture whether the feature may touch schema, API contracts, backward compatibility, sensitive data, permissions, data retention, integrations, observability, or migration timing.

Do not prescribe the exact architecture; hand those implications to `engineering-manager`.

## Output

```markdown
# Product Brief

Goal:

Users:

Release Slice:

Requirements:

Acceptance Criteria:

Non-Goals:

Risks:

Open Decisions:

Technical Implications:

Engineering Handoff:
```
