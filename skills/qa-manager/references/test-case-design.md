# Test Case Design

Use this reference for manual test cases, BDD scenarios, regression suites, edge-case design, and combinatorial coverage.

## Case Design Rules

- Every case needs objective, preconditions, test data, steps, expected result, priority, and traceability source.
- Prefer observable behavior over implementation detail.
- Split cases when one scenario verifies unrelated outcomes.
- Include positive, negative, boundary, permission, error-state, and regression cases.
- Mark cases that require automation, manual execution, security review, or production-like data.
- Every case row must also populate the **Execution-Readiness Matrix** (see Output). Use `n/a` only when a field is structurally absent (e.g., `verification_command` for a pure exploratory case). Never leave a cell blank — a blank cell means the case is not yet executable and downstream skills will reject it.

## BDD Shape

```gherkin
Scenario: <observable behavior>
  Given <precondition>
  When <user or system action>
  Then <expected result>
```

Use BDD when product, QA, and engineering need a shared language. Avoid Gherkin for low-level unit behavior where plain test names are clearer.

## PICT-Style Combinatorial Coverage

Use pairwise or combinatorial design when many independent input dimensions create too many full combinations.

1. List parameters and valid values.
2. Add constraints for impossible or invalid combinations.
3. Generate a compact matrix manually or with a PICT-compatible tool when available.
4. Add explicit high-risk combinations even if pairwise already covers them.
5. Keep the generated matrix tied to requirement IDs and expected outcomes.

## Output

```markdown
# Test Cases

Coverage Goal:

Case Table:

Execution-Readiness Matrix:

| case_id | source_requirement | implementation_owner | automation_level | required_fixture | environment | verification_command | evidence_artifact | blocked_dependency |
|---------|--------------------|----------------------|------------------|------------------|-------------|----------------------|-------------------|--------------------|

Combinatorial Model:

High-Risk Cases:

Automation Candidates:
```

### Execution-Readiness Matrix column rules

- `case_id` — stable id; must match the row in Case Table and any traceability map.
- `source_requirement` — PRD section, AC id, ticket, ADR. One reference per row; split the case if more.
- `implementation_owner` — `<repo> / <skill>` that will write or run the check, e.g. `backend-user-engine-v2 / qa-engineer`, `product-engine-v2 / qa-tester`.
- `automation_level` — `unit | integration | contract | e2e | manual | exploratory`.
- `required_fixture` — seed file, factory, mock service, recorded payload, or feature flag state needed before execution.
- `environment` — `local | ci | staging | sandbox-provider | prod-readonly`. Never `prod-write`.
- `verification_command` — exact shell or step that produces evidence (e.g., `go test ./internal/migration/... -run NativeAPDK`). `n/a` for exploratory cases only.
- `evidence_artifact` — what the run must emit (log path, screenshot, HAR, junit xml, k6 summary, Bruno collection result).
- `blocked_dependency` — `none` or the named gap holding execution back (missing env var, vendor credential, upstream PR, schema migration, unresolved decision).

Any case row whose `blocked_dependency` is non-`none` MUST also appear in the Findings Bundle `blocked checks` section and contribute to a `release_signoff` of `blocked` until resolved.
