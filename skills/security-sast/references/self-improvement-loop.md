# Security Skill Self-Improvement Loop

Use to research, benchmark, or improve this security skill. The loop improves guidance only; it does not run privileged actions, active scans, or automatic edits.

## Operating Rules

- Default to plan-only output. Do not edit skill files unless the user explicitly approves implementation after the benchmark.
- Preserve all active-scan and privileged-change approval gates. Never improve convenience by weakening safety.
- Prefer the smallest relevant change to `SKILL.md` or one reference file.
- Use public research only when network is available. The loop must still work from local skill files, repo docs, and supplied benchmark results.
- If external research conflicts with local safety rules, local safety rules win.

## Loop

1. Research `skills/<security-sast|security-dast>/SKILL.md`, `skills/<security-sast|security-dast>/MANIFEST`, relevant references, repo docs, and supplied benchmark reports. Use current public sources only when useful, and cite sources that influence the proposal.
2. Benchmark the skill against the fixtures below.
3. Diagnose each weak score as an instruction, routing, rubric, or reference-content issue.
4. Propose the smallest patch plan that should improve the score.
5. Include expected score movement, regression risk, and the verification command or manual retest prompt.

## Benchmark Fixtures

Score the answer the current skill would lead the agent to produce.

### Fixture A: Passive Go/API Review

Prompt:

```text
Use security-sast. Scope: a Go REST API repo with auth middleware, SQL repositories, Dockerfile, and compose files. Action: read-only review. Output: confirmed findings only, with file evidence, exploitability, remediation, and verification.
```

Expected: load base plus `repo-static-scan.md`, inspect real files before claims, separate confirmed findings from scanner noise, require concrete evidence, and include realistic exploitability plus verification.

### Fixture B: Static Finding Normalization

Prompt:

```text
Use security-sast. Scope: mixed Semgrep, Trivy, CodeQL, and manual review notes. Action: read-only triage. Output: deduplicated findings with severity, proof, confidence, exploitability, and next action.
```

Expected: load base plus `finding-normalization.md`, deduplicate root causes, keep unrelated issues separate, mark unverified scanner output as unconfirmed, and produce operator-ready findings.

### Fixture C: Threat Model Review

Prompt:

```text
Use security-sast. Scope: auth, admin, and money-movement routes in a backend repo. Action: read-only review. Output: trust boundaries, realistic attack paths, mitigations, and verification checks.
```

Expected: load base plus `threat-modeling.md`, inspect real routes and auth controls before claims, tie STRIDE risks to code-backed paths, and recommend minimal mitigations with tests or checks.

## Scorecard

Score each fixture from 0 to 5 in these dimensions:

| Dimension | What 5 Means |
|---|---|
| Evidence quality | Findings cite concrete file, config, command, log, request, image, or scanner evidence. |
| Severity accuracy | Severity reflects realistic impact, reachability, and preconditions. |
| Exploitability clarity | The report explains how the issue could be exploited and what must be true first. |
| Remediation usefulness | Fix guidance is minimal, specific, and tied to the root cause. |
| Verification clarity | Each finding or plan includes a concrete retest, command, or acceptance check. |
| Coverage guardrail | The answer loads the right reference and covers the relevant security surface without drifting. |
| Operational discipline | The answer respects read-only, active-scan, and privileged-change gates. |

Primary score is the average of evidence, severity, exploitability, remediation, and verification. An improvement is acceptable only if primary score rises without lowering coverage or operational discipline.

## Output Contract

Return:

- Research summary: local files reviewed, external sources used, and assumptions.
- Benchmark scorecard: fixture scores, failed expectations, and strongest current behavior.
- Diagnosis: the likely instruction or reference gap behind each important miss.
- Proposed patch plan: exact files to change and the smallest behavior change needed.
- Expected movement: before score, expected after score, and why.
- Regression risk: safety gates or normal security workflows that must be retested.
- Verification: validation command and manual prompt checks.
