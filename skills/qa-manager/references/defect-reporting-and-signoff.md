# Defect Reporting And Sign-Off

Use this reference for bug reports, QA summaries, audit-style reports, blocked checks, and release recommendations.

## Defect Rules

Each confirmed defect needs:

- Title
- Severity
- Environment
- Preconditions
- Steps to reproduce
- Expected result
- Actual result
- Evidence
- Impact
- Suspected owner
- Retest checklist

Separate confirmed defects from suspected gaps. Do not report preferences as defects unless they break acceptance, accessibility, security, or usability.

## Severity

- Blocker: release should not proceed.
- Major: release can proceed only with explicit risk acceptance or immediate fix.
- Minor: follow-up is acceptable.

Severity reflects user impact and release risk, not how much code changed.

## Sign-Off Output

```markdown
# QA Sign-Off

Status:

Scenarios Covered:

Defects:

Coverage Gaps:

Blocked Checks:

Retest:

Release Recommendation:

Downstream Handoffs:
```
