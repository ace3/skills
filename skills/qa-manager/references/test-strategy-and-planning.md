# Test Strategy And Planning

Use this reference for test plans, release test strategy, regression scope, sprint testing workflow, and go/no-go criteria.

## Strategy Inputs

- Product intent and acceptance criteria.
- Implementation scope and changed subsystems.
- Existing automated tests, manual checks, and known coverage gaps.
- Environments, test data, dependencies, and credentials available for safe QA.
- Release risk, rollback needs, and observability requirements.

## Plan Shape

1. Define scope and out-of-scope areas.
2. Choose test levels: unit, integration, contract, E2E, accessibility, performance, security handoff, exploratory.
3. Define risk-based priority: blocker coverage first, then major user journeys, then lower-risk regression.
4. Name entry criteria, exit criteria, blockers, and known constraints.
5. Assign downstream ownership: `qa-engineer` for test code, `qa-tester` for execution, security skills for security checks.

## Dual Status

Every qa-manager artifact reports two named statuses. They answer different questions and a single value cannot represent both — that is why earlier outputs collapsed to `partial` were misread.

### QA Plan Readiness

Does the plan itself meet the bar to be acted on?

- `draft` — coverage gaps remain or scope is still moving; not safe to start execution.
- `usable` — covers the agreed scope; execution can begin even though some sections may iterate.
- `complete` — every in-scope acceptance criterion mapped; every case row has a fully populated Execution-Readiness Matrix entry (no `n/a` on required fields).

### Release Sign-Off

Can the change ship?

- `pass` — critical scenarios ran, defects absent or accepted.
- `conditional_pass` — proceed only with named risk acceptance and retest plan.
- `fail` — blocker or major risk remains unmitigated.
- `blocked` — required environment, data, credential, or evidence is missing; cannot decide.
- `not_applicable` — plan-stage artifact; release decision has not yet been requested.

### Independence

A plan can be `usable` while the release is `blocked` (e.g., the matrix is filled but a vendor credential is missing). Conversely, a release can be `pass` even when plan readiness is `usable` rather than `complete`, as long as all blocker-priority cases executed with evidence. Report both honestly.

### Mapping to the shared Findings Bundle JSON `status`

The shared `output-contracts.md` schema is unchanged. Top-level JSON `status` is derived from `release_signoff`:

| release_signoff   | JSON status |
|-------------------|-------------|
| pass              | pass        |
| conditional_pass  | partial     |
| fail              | fail        |
| blocked           | blocked     |
| not_applicable    | partial     |

`qa_plan_readiness` is not encoded in JSON; surface it only in the Markdown Status block above the JSON.

## Output

```markdown
# QA Test Plan

Status:
- QA Plan Readiness: draft | usable | complete
- Release Sign-Off:  pass | conditional_pass | fail | blocked | not_applicable

Scope:

Risk Areas:

Test Levels:

Scenario Groups:

Entry Criteria:

Exit Criteria:

Owners:

Release Gate:
```
