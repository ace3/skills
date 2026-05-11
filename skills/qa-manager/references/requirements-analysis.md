# Requirements Analysis

Use this reference when QA needs to read a PRD, ticket, implementation plan, design, or engineering handoff and determine what is testable.

## Procedure

1. Extract intended users, workflows, business rules, acceptance criteria, non-goals, and release constraints.
2. Convert requirements into testable conditions with observable inputs and outputs.
3. Identify ambiguity, missing acceptance criteria, hidden dependencies, unsupported edge cases, and conflicting statements.
4. Classify risk by user impact, data integrity, auth, money movement, external integrations, migrations, and operational blast radius.
5. Build a traceability map from requirement to scenario category, existing evidence, and open gap.

## Gap Types

- Ambiguous: multiple valid interpretations exist.
- Untestable: no observable expected result is defined.
- Missing: required behavior is implied but not stated.
- Conflicting: two sources cannot both be true.
- Risky: behavior is testable but release impact needs explicit coverage.

## Output

```markdown
# Requirements QA

Status:

Testable Conditions:

Ambiguities:

Missing Acceptance Criteria:

Risk Classification:

Traceability:

Questions:
```
