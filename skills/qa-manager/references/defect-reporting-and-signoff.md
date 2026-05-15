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
- QA Plan Readiness: draft | usable | complete
- Release Sign-Off:  pass | conditional_pass | fail | blocked | not_applicable

Scenarios Covered:

Defects:

Coverage Gaps:

Blocked Checks:

Retest:

Release Recommendation:

Downstream Handoffs:
```

The two statuses answer different questions and must not be collapsed:

- `QA Plan Readiness` — is the plan itself good enough to act on?
- `Release Sign-Off` — can we ship the change?

A plan can be `usable` while the release is `blocked` (e.g., the matrix is filled in but a vendor credential is missing). Surface both. The shared Findings Bundle JSON `status` is derived from `release_signoff` per the mapping in `test-strategy-and-planning.md` — keep them aligned so downstream parsers and humans never disagree.
