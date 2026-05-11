# Feature Delivery Workflow

Use this reference for natural feature requests where the user expects one agent to drive delivery from idea to verified implementation.

## Operating Model

`feature-delivery` is the end-to-end wrapper. It borrows the role pipeline from `dev-orchestrator`, the implementation planning discipline from `engineering-manager`, execution behavior from `backend-developer` and `frontend-developer`, and report-only review gates from `qa`, `qa-manager`, `qa-engineer`, `qa-tester`, `security-sast`, `security-dast`, `monitoring`, and `deployment-ops`.

Do not ask the user to invoke those skills manually. Apply their behavior as internal contracts. Route to a real handoff only when a gate explicitly requires it.

## Procedure

0. **Worktree decision (always first).** Ask the user: develop on an isolated git worktree, or directly on the current branch? Wait for the answer. If yes, set up the worktree and switch into it before reading the repo (see `worktree-isolation.md`). If no, record `Working directly on <current branch> — no worktree.` Never skip this question.
1. Inspect the repo: entrypoints, package scripts, configs, routes, schemas, data models, service boundaries, providers, tests, docs, and env examples.
2. State assumptions and the execution loop:
   ```text
   1. Scope feature -> verify: acceptance criteria are concrete
   2. Plan minimal implementation -> verify: risks and test strategy are known
   3. Implement slices -> verify: focused tests pass after each slice
   4. Review security/QA -> verify: release-blocking issues are resolved or reported
   5. Finish -> verify: final command/browser/API evidence is included
   ```
3. Decide whether `product-manager` behavior is needed. Use it only when product intent, users, acceptance criteria, or non-goals are materially unclear from the repo and the request.
4. Produce a compact implementation plan before editing: smallest slice, touched subsystems, data flow, risk tier, task order, tests, and gates.
5. Auto-continue into implementation unless a stop gate applies.
6. Implement with existing project patterns. Keep changes surgical and traceable to the request. Reuse existing utilities; do not introduce abstractions speculatively.
7. Add or update focused tests for changed behavior. Tests come with the code, not after the fact.
8. Run narrow checks first, then broader checks when the change touches shared contracts, auth, payments, data, or routing.
9. Perform QA and security review proportional to risk tier (see below).
10. Finish with the delivery-report evidence shape.

## Risk Routing

- **T0 critical**: money movement, auth/authz, secrets, callbacks, webhooks, queue consumers, concurrency, irreversible operations, production data, or external contracts. Require test-first planning, security review, rollback/recovery notes, and post-change verification. Pause for explicit user confirmation on any business rule that cannot be inferred from the repo.
- **T1 high**: schema migration, breaking API change, multi-service coordination, or production data transformation. Require compatibility analysis, observability, and a regression strategy.
- **T2 medium**: contained API addition, local feature, moderate UI flow, or single-service behavior. Require focused tests and acceptance checks.
- **T3 low**: docs, copy, isolated config, or small tooling. Require a sanity check.

## Stop Gates

Stop and ask only when continuing would require:

- destructive command execution
- production data mutation
- real payment credentials or live provider actions
- irreversible migrations
- privileged deployment, push, PR, or release execution not requested by the user
- unclear business rules that affect money movement or user permissions

For destructive or security-sensitive operations, print the exact command for the user to run manually and continue from their reported result. Never run privileged or destructive operations yourself.

## Internal Skill Contracts

- `research`: external vendor docs, current library/API facts, or missing repo evidence.
- `product-manager`: product scope and acceptance criteria only when genuinely ambiguous.
- `engineering-manager`: boundaries, task order, risk tier, tests, rollout, and rollback.
- `backend-developer`: API, data, queues, jobs, auth, idempotency, migrations, provider integrations.
- `frontend-developer`: UI flows, forms, state, API integration, accessibility, browser verification.
- `diagnose`: unclear root cause, flaky behavior, failing checks, or broken runtime behavior surfacing during delivery.
- `qa`: broad QA routing when the correct QA role is not obvious.
- `qa-manager`: requirements coverage, test strategy, test plans, test cases, defect process, and release sign-off.
- `qa-engineer`: TDD, unit/integration/contract/BDD/E2E test-code guidance, framework setup, and CI test pipeline planning.
- `qa-tester`: browser, API, performance, visual, exploratory, and retest execution evidence.
- `security-sast`: source, config, dependency, secrets, containers, IaC, threat model.
- `security-dast`: authorized runtime probing, callback/API/web active checks, TLS, retest evidence.
- `monitoring`: read-only health, observability gaps, alerts, dependency/runtime inventory.
- `deployment-ops`: release readiness, rollback, controlled deploy, post-deploy verification.
- `release-manager`: release notes, rollout steps, rollback paths, and post-release checks after engineering, QA, and security are green.
- `document-release`: release communication, operator updates, and post-release confirmation from verified evidence.

## Finish Criteria

- Feature behavior is implemented or blocked by a named gate.
- Tests/checks relevant to the changed behavior ran.
- Security-sensitive paths have been reviewed.
- Any skipped or blocked verification is explicit.
- Final output follows `delivery-report.md` and includes a `Worktree:` line.
- After the user confirms the feature is OK, run the merge/cleanup prompt from `worktree-isolation.md`. Never merge or remove a worktree without an explicit user yes.
