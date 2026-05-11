# Exploratory Evidence Reporting

Use this reference for exploratory sessions, retesting, final QA evidence, and release recommendation.

## Exploratory Session

1. Define a charter: target, risk, time box, and expected insight.
2. Follow realistic user workflows before edge probes.
3. Vary data, permissions, network state, viewport, and timing where relevant.
4. Record notes as timestamped observations, not conclusions.
5. Convert repeatable issues into defect reports with steps and evidence.

## Retest

- Start from the original defect and expected fix.
- Re-run the failing path first.
- Re-run the smallest relevant regression set.
- Mark each item pass, fail, blocked, or not run.
- Do not call a defect fixed without evidence from the affected path.

## Evidence Rules

- Include command, URL, environment, account type, data fixture, screenshot, log excerpt, trace, or API response summary where useful.
- Redact secrets and personal data.
- Distinguish "not observed" from "verified absent".

## Output

```markdown
# QA Execution Report

Status:

Environment:

Charter:

Checks Run:

Evidence:

Defects:

Coverage Gaps:

Retest:

Release Recommendation:
```
