# Benchmark Quality

Use when comparing agent outputs, branches, patches, or implementation candidates.

## Rubric

- Target behavior: which candidate best satisfies the requested behavior.
- Security invariant: which candidate preserves auth, integrity, data, and fail-closed rules.
- Integration fit: which candidate matches existing architecture, contracts, and operations.
- Test quality: which candidate proves happy paths, edge cases, regressions, and failure modes.
- Maintainability: which candidate is simplest to read, change, and operate.
- Merge readiness: which candidate has the smallest remaining risk and cleanup.

## Evidence Rules

- Separate measured facts from interpretation.
- Include commands run and exact evidence: test names, exit codes, logs, diffs, or file references.
- Name what to keep from each candidate, even when one candidate is the clear winner.
