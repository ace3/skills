# Benchmark Quality Review

Use this when comparing two or more branches, agents, implementations, plans, prompts, or skill outputs.

## Method

1. Define the target behavior and the baseline.
2. State the workload, repo state, commands, environment, and scoring rubric.
3. Separate measured facts from interpretation.
4. Inspect unrelated diffs before judging quality. A better implementation inside a dirty branch may still need cherry-pick or rebase.
5. Score only the relevant surfaces: correctness, security, integration fit, tests, surgical scope, maintainability, operability, and merge readiness.
6. Name the winning approach and the exact changes worth importing from the losing approach.

## Evidence

Include:

- Branch, commit, or artifact identifiers.
- Commands run and whether they passed, failed, or were blocked.
- Focused tests that map to the target behavior.
- Full-suite or broad-check failures only when they differentiate the candidates.
- Files or behavior surfaces reviewed.
- Known unrelated changes, stale branch risk, generated churn, or merge hazards.

## Output

```markdown
Verdict:

Score:

Why:

Where the other candidate is stronger:

Merge readiness:

Verification:

Recommendation:
```

Keep the recommendation actionable: base branch, cherry-pick scope, tests to import, and checks to rerun.
