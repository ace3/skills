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

## Release Sign-Off

- Pass: critical scenarios ran and defects are absent or accepted.
- Conditional pass: release can proceed only with named risk acceptance and retest plan.
- Fail: blocker or major risk remains unmitigated.
- Blocked: required environment, data, credential, or evidence is missing.

## Output

```markdown
# QA Test Plan

Scope:

Risk Areas:

Test Levels:

Scenario Groups:

Entry Criteria:

Exit Criteria:

Owners:

Release Gate:
```
