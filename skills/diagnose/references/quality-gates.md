# Quality Gates

Shared definition of "done" for execution and review skills. Apply when doing substantive work — implementation, fixes, planning, QA, security review, deployment changes, or diagnosis. Skip for trivial single-line edits or pure routing.

## Definition of Done

- Inspected the real current context (code, tests, configs, runtime state) before proposing or claiming a change. No reasoning from assumed file shapes.
- Stated assumptions explicitly when ambiguity exists. Do not silently pick.
- Made the minimal scoped change needed to satisfy the request. No drive-by refactors, speculative abstractions, or unrelated cleanup.
- Verified behavior with concrete evidence — ran tests, exercised the path in a browser or via API, inspected logs, or named exactly why verification was not possible.
- Listed every check that was blocked, skipped, deferred, or could not run. Hidden skips are forbidden.

## Evidence Rules

Every success claim cites at least one of:

- File path with line number for code-level claims.
- Command + exit code + relevant output for build/test/lint claims.
- Test name + result for test-coverage claims.
- Browser screenshot, network trace, or interaction log for UI claims.
- API request/response excerpt for backend behavior claims.
- Runtime log excerpt for production-behavior claims.

Banned phrasings without evidence: "should work", "looks good", "appears to be correct", "this should fix it", "tests should pass". Either run the check or report the check as blocked.

## Falsification Check

Before finalizing complex or risky work, answer: "What would prove this wrong?" Then run that check. If the check cannot be run, list it as a gap. The goal is to catch the failure mode the implementation might have missed, not to gather more evidence for the chosen approach.

## Anti-Pattern Checks

Reject the following before reporting a result:

- **Existence-only validation when identity binding is required** (security, backend) — checking that a token, signature, or record exists without binding it to the actor or resource it must authorize.
- **Docs-only fix when runtime enforcement is needed** (security, backend) — adding a note to documentation or a code comment instead of a check that fails closed at runtime.
- **New abstractions without a concrete current consumer** (backend, frontend) — interfaces, base classes, or generics introduced for hypothetical future use.
- **Implementation without focused verification** (all execution skills) — code changes shipped without exercising the changed path end to end.
- **Hidden skipped checks in final output** (all skills) — declaring success while quietly omitting a check that was blocked, flaky, or deferred.
- **Backwards-compatibility shims for code paths that have no current consumer** — kept-around fields, renamed-stub functions, or feature flags wrapping a single call site.

## Output Contract Addendum

Every final response from a skill that applied these gates must surface, regardless of bundle shape:

- **Changed behavior** — what the user will observe differently.
- **Assumptions** — what was decided without explicit input, and the basis for each.
- **Verification** — the evidence above, listed concretely.
- **Blocked or skipped checks** — every check that did not run, and why.
- **Residual risk** — what could still be wrong, and the cheapest next check to catch it.

Place these inside the existing bundle (Findings, Plan, or Routing) — do not invent a new top-level shape. When a field has no entries, write "None" rather than omitting it, so reviewers can tell the gate ran.
