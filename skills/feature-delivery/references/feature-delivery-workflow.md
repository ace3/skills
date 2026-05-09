# Feature Delivery Workflow

Use this reference for natural feature requests where the user expects one agent to drive delivery from idea to verified implementation.

## Operating Model

`feature-delivery` is the end-to-end wrapper. It borrows the role pipeline from `dev-orchestrator`, the implementation planning discipline from `engineering-manager`, execution behavior from backend/frontend developer skills, and review gates from QA, security, monitoring, and deployment skills.

Do not ask the user to invoke those skills manually. Apply their behavior as internal contracts.

## Procedure

1. Inspect the repo: entrypoints, package scripts, configs, routes, schemas, data models, service boundaries, providers, tests, docs, and env examples.
2. State assumptions and the execution loop:
   ```text
   1. Scope feature -> verify: acceptance criteria are concrete
   2. Plan minimal implementation -> verify: risks and test strategy are known
   3. Implement slices -> verify: focused tests pass after each slice
   4. Review security/QA -> verify: release-blocking issues are resolved or reported
   5. Finish -> verify: final command/browser/API evidence is included
   ```
3. Decide whether product-manager behavior is needed. Use it only when product intent, users, acceptance criteria, or non-goals are materially unclear.
4. Produce a compact implementation plan before editing: smallest slice, touched subsystems, data flow, risk tier, task order, tests, and gates.
5. Auto-continue into implementation unless a stop gate applies.
6. Implement with existing project patterns. Keep changes surgical and traceable to the request.
7. Add or update focused tests for changed behavior.
8. Run narrow checks first, then broader checks when the change touches shared contracts, auth, payments, data, or routing.
9. Perform QA and security review proportional to risk.
10. Finish with delivery report evidence.

## Risk Routing

- T0 critical: money movement, auth/authz, secrets, callbacks, concurrency, irreversible operations, production data, or external contracts. Require test-first planning, security review, rollback/recovery notes, and post-change verification.
- T1 high: schema migration, breaking API, multi-service coordination, or production data transformation. Require compatibility, observability, and regression strategy.
- T2 medium: contained API addition, local feature, moderate UI flow, or single-service behavior. Require focused tests and acceptance checks.
- T3 low: docs, copy, isolated config, or small tooling. Require a sanity check.

## Stop Gates

Stop and ask only when continuing would require:

- destructive command execution
- production data mutation
- real payment credentials or live provider actions
- irreversible migrations
- privileged deployment, push, PR, or release execution not requested by the user
- unclear business rules that affect money movement or user permissions

For destructive or security-sensitive operations, print the exact command for the user to run manually and continue from their reported result.

## Internal Skill Contracts

- `research`: external vendor docs, current library/API facts, or missing repo evidence.
- `product-manager`: product scope and acceptance criteria only when genuinely ambiguous.
- `engineering-manager`: boundaries, task order, risk tier, tests, rollout, and rollback.
- `backend-developer`: API, data, queues, jobs, auth, idempotency, migrations, provider integrations.
- `frontend-developer`: UI flows, forms, state, API integration, accessibility, browser verification.
- `diagnose`: unclear root cause, flaky behavior, failing checks, or broken runtime behavior.
- `qa`: acceptance, regression, edge cases, defects, and retest evidence.
- `security-sast`: source, config, dependency, secrets, containers, IaC, threat model.
- `security-dast`: authorized runtime probing, callback/API/web active checks, TLS, retest evidence.
- `monitoring`: read-only health, observability gaps, alerts, dependency/runtime inventory.
- `deployment-ops`: release readiness, rollback, controlled deploy, post-deploy verification.

## Finish Criteria

- Feature behavior is implemented or blocked by a named gate.
- Tests/checks relevant to the changed behavior ran.
- Security-sensitive paths have been reviewed.
- Any skipped or blocked verification is explicit.
- Final output follows `delivery-report.md`.
