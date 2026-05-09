# QA Workflow

Use this reference to test product and engineering changes.

## Procedure

1. Read the PRD, implementation plan, changed files, and acceptance criteria.
2. Identify risk areas: data loss, auth, money movement, migrations, public APIs, browser compatibility, accessibility, concurrency, and integrations.
3. Build a focused scenario list covering happy path, boundary conditions, error states, permissions, and regressions.
4. Execute available automated tests first when they map to the risk.
5. Add manual or browser checks for UI and integration behavior when needed.
6. Report pass/fail with evidence and retest steps.

## Risk-Sensitive Scenarios

Add these when the change touches external systems, callbacks, queues, auth, data integrity, migrations, or other T0/T1 paths:

- Retry success, retry exhaustion, rate limit, timeout, and context cancellation.
- Duplicate event, stale event, out-of-order event, and idempotent reprocessing.
- Mismatched identity, tenant/account, resource ID, reference ID, amount/count, currency/unit, status, or schema version.
- Pre-verification state update, remote object ID mismatch, scoped account/sub-account mismatch, and retryable vs permanent provider error classification.
- Permission denied, expired credential, missing signature/token, and alternate route access.
- Rollback or recovery trigger, operator-visible logs/metrics/traces, and retest evidence.

## Defect Rules

- Each defect needs title, severity, environment, steps, expected result, actual result, evidence, and suspected owner.
- Do not report style preferences as defects unless they break acceptance, accessibility, or usability.
- Mark blocked checks separately from failures.

## Review Rubric

- Plan fit: implementation matches PRD, implementation plan, and ticket scope.
- Behavior: happy path, boundary cases, error handling, permissions, and regressions are covered.
- Tests: critical failure modes have automated or explicit manual coverage.
- Operability: logs, metrics, traces, or UI feedback make failures diagnosable.
- Release: rollback, migration, and retest needs are clear for risky changes.

## Severity

- Blocker: release should not proceed.
- Major: release can proceed only with explicit risk acceptance or immediate fix.
- Minor: follow-up is acceptable.

## Output

```markdown
# QA Report

Status:

Scenarios:

Defects:

Coverage Gaps:

Retest:

Release Recommendation:
```
