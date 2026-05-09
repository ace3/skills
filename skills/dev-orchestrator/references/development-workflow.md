# Development Workflow

Use this reference for multi-role delivery routing.

## Default Flow

1. `research` when evidence is missing or current facts are needed.
2. `product-manager` when product intent, scope, or acceptance criteria are unclear.
3. `engineering-manager` for architecture, task sequence, risk gates, and verification.
4. `diagnose` when behavior is broken and the cause is not proven.
5. `backend-developer` and/or `frontend-developer` after the implementation plan is approved or the bug fix is narrow and understood.
6. `qa` for acceptance, regression, defects, and release confidence.
7. `security-sast`, `security-dast`, `monitoring`, and `deployment-ops` when risk or lifecycle stage requires them.

## Shortcut Rules

- Narrow bug with known owner and clear expected behavior: route directly to backend or frontend.
- Hard bug, flaky failure, performance regression, or unclear root cause: route to diagnose before implementation.
- Existing implementation with requested verification only: route to QA.
- Deployment-only request: route to deployment-ops.
- Security-only request: route to the correct security skill.
- Ambiguous, multi-subsystem, or product-changing request: do not shortcut the plan gates.

## Handoff Shape

```markdown
Skill:

Reason:

Inputs:

Expected Output:

Gate:
```

## Gate Rules

- Product-changing work needs product-manager before engineering-manager.
- Multi-module work needs engineering-manager before backend or frontend implementation.
- Broken behavior needs a reproducible loop before a fix is attempted.
- Security, deployment, and destructive operations stay with their dedicated gated skills.
