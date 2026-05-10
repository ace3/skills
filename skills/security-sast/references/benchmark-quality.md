# Benchmark Quality

Use when comparing agent outputs, branches, patches, implementation candidates, QA reports, or security findings.

## Method

- Start from the target behavior and non-negotiable invariants, not from candidate intent.
- Inspect candidate diffs and integration points. Run available validation or name the exact blocker.
- Separate measured facts from interpretation before scoring.
- Compare only relevant behavior unless unrelated changes affect merge or release risk.
- "Passes tests" is not the same as "solves the actual risk." Score the underlying behavior, not the test suite green-checkmark alone.

## Rubric

- Target behavior: which candidate best satisfies the requested behavior under realistic inputs.
- Security invariant: which candidate preserves auth, identity binding, integrity checks, source-of-truth comparisons, data safety, and fail-closed defaults.
- Integration fit: which candidate matches existing architecture, contracts, conventions, and operational shape.
- Test quality: which candidate proves happy paths, edge cases, regressions, and failure modes — including negative tests for the risk being mitigated.
- Maintainability: which candidate is simplest to read, change, and operate.
- Merge or release readiness: which candidate has the smallest remaining risk, cleanup, and operational unknowns.

## Evidence Rules

- Separate measured facts from interpretation.
- Include commands run and exact evidence: test names, exit codes, logs, diffs, file paths, request/response excerpts, or runtime traces.
- Name what to keep from each candidate, even when one candidate is the clear winner.
- If a check could not be run, name it as a gap — never imply a check passed when it was skipped.

## Output Contract

- Verdict: winner, confidence, and merge/release-readiness status.
- Measured facts: commands, exit codes, changed files, tests, and observed behavior.
- Interpretation: rubric scores and why they follow from the facts.
- Keep list: the specific behavior, test, code pattern, or simplification to keep from each candidate.
- Gaps: blockers, missing evidence, skipped checks, and the smallest next action.
