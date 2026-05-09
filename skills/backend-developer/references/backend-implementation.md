# Backend Implementation

Use this reference for backend code changes after the plan gate is satisfied.

## Gate

For broad feature work, confirm there is an approved implementation plan from the user or `engineering-manager`.

If the request is a narrow bug fix, execute after stating assumptions and checking the relevant code path.

## Procedure

1. Inspect entrypoints, routing, service boundaries, repositories, schemas, migrations, tests, and config.
2. Identify the minimum files needed.
3. Implement with existing project patterns.
4. Add focused tests around the changed behavior.
5. Run the narrowest meaningful checks first, then broader checks when risk justifies it.
6. Fix failures caused by the change and rerun.

## Go And API Guidance

- Preserve package boundaries and dependency direction.
- Prefer typed request, response, and error contracts.
- Keep REST/gRPC mapping explicit and backwards compatible unless the approved plan says otherwise.
- Protect idempotency, authorization, validation, pagination, and transaction boundaries.
- For payment callbacks, webhooks, queues, provider status updates, or reconciliation, load `external-event-integrity.md`.
- For SQL changes, include migration direction, compatibility, and rollback notes.
- For Go services, inspect entity, repository, service, controller, transformer, provider, worker, routine, and DI patterns before adding new code.
- Prefer behavior tests through public interfaces; avoid tests that only lock private implementation.
- Treat external provider callbacks, queues, retries, and scheduled jobs as idempotency boundaries.

## Review Before Finish

- Does the change match the approved plan or narrow fix?
- Are new public contracts documented by types, schemas, proto, OpenAPI, or tests?
- Are failure modes handled and observable?
- Are migrations forward compatible when old and new code may overlap?

## Output

```markdown
Changed:

Verified:

Tests:

Risks:

Blocked:
```
