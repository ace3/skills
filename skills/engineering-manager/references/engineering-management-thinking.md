# Engineering Management Thinking

Use this before broad implementation plans, architecture reviews, T0/T1 work, or plans that need role-based handoff.

## Role Boundary

Engineering management owns architecture, scope, risk tier, boundaries, invariants, failure modes, test strategy, deploy readiness, and handoff clarity.

Engineering management does not dictate low-level implementation detail unless it affects architecture, a public contract, an invariant, risk, operability, or team ownership.

## Thinking Defaults

- Optimize for lower future pain, not only current speed.
- Prefer boring, proven technology unless the problem truly needs a new pattern.
- Make reversible choices when the cost of being wrong is high.
- Split structural cleanup from behavior change when both are needed.
- Design for tired operators: observable failures, clear runbooks, rollback steps, and ownership.
- Use forcing questions when a decision is unclear. Number questions and give concrete options.
- Make outputs consumable by roles: `engineer`, `qa-reviewer`, `security-reviewer`, `release-engineer`, `devops`, or `pm`.

## Risk Tiering

- T0 Critical: irreversible operations, auth/authz, secrets, concurrency/state machines, external contracts with material impact, sensitive data, money movement, or destructive production actions. Requires test-first strategy, security review, explicit rollback or recovery, and post-deploy monitoring.
- T1 High: migrations, breaking APIs, multi-service coordination, broad data transformation, or T0-adjacent observability gaps. Requires compatibility, migration, regression, and rollout strategy.
- T2 Standard: isolated, additive, reversible feature or contained API/UI behavior. Requires focused tests and stated invariants.
- T3 Trivial: docs, comments, isolated config, or tooling with no product behavior change. Requires sanity check only.

Promote risk upward when reversibility is weak, blast radius is broad, sensitive data is present, ownership is unclear, or the failure would be silent.

## Plan Checklist

For T0/T1, the plan must include:

- Boundaries: what is in scope, what stays outside, and who owns each affected component.
- Data flow: sync versus async hops, external calls, storage writes, and backpressure behavior.
- State transitions: allowed transitions, forbidden transitions, side effects, and concurrency handling.
- Trust boundaries: where input, identity, authorization, provider responses, and secrets are validated.
- Invariants: specific, testable, falsifiable conditions that must remain true.
- Failure modes: scenario, handling, test coverage, user visibility, severity, and rollback or recovery.
- Test strategy: unit, integration, contract, security, migration, manual, or runtime checks tied to the failure modes.
- Deploy readiness: env vars, secrets, migrations, flags, rollout strategy, rollback trigger, monitoring window, and owner.
- Role handoff: what each downstream role needs to act without rereading the whole discussion.

For T2/T3, keep the plan compact and include only the sections that materially reduce risk.
