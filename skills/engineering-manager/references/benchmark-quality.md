# Benchmark Quality

Use when comparing agent outputs, branches, patches, or implementation candidates.

## Method

- Start from the target behavior and non-negotiable invariants, not from candidate intent.
- Inspect candidate diffs and integration points. Run available validation or name the exact blocker.
- Separate measured facts from interpretation before scoring.
- Compare only relevant behavior unless unrelated changes affect merge risk.

## Rubric

- Target behavior: which candidate best satisfies the requested behavior.
- Security invariant: which candidate preserves auth, integrity, source-of-truth checks, data safety, and fail-closed rules.
- Integration fit: which candidate matches existing architecture, contracts, and operations.
- Test quality: which candidate proves happy paths, edge cases, regressions, and failure modes.
- Maintainability: which candidate is simplest to read, change, and operate.
- Merge readiness: which candidate has the smallest remaining risk and cleanup.

## Evidence Rules

- Separate measured facts from interpretation.
- Include commands run and exact evidence: test names, exit codes, logs, diffs, or file references.
- Name what to keep from each candidate, even when one candidate is the clear winner.

## Output Contract

- Verdict: winner, confidence, and merge-readiness status.
- Measured facts: commands, exit codes, changed files, tests, and observed behavior.
- Interpretation: rubric scores and why they follow from the facts.
- Keep list: the specific behavior, test, code pattern, or simplification to keep from each candidate.
- Gaps: blockers, missing evidence, and the smallest next action.
