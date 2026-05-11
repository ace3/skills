# Test Case Design

Use this reference for manual test cases, BDD scenarios, regression suites, edge-case design, and combinatorial coverage.

## Case Design Rules

- Every case needs objective, preconditions, test data, steps, expected result, priority, and traceability source.
- Prefer observable behavior over implementation detail.
- Split cases when one scenario verifies unrelated outcomes.
- Include positive, negative, boundary, permission, error-state, and regression cases.
- Mark cases that require automation, manual execution, security review, or production-like data.

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

Combinatorial Model:

High-Risk Cases:

Automation Candidates:
```
