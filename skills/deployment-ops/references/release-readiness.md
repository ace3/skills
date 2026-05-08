# Release Readiness

Use for artifact digest, dependency, migration, preflight, ownership, and go/no-go gates.

## Procedure

1. Confirm release scope, environment, services, owners, and dependencies.
2. Pin artifact identity: image digest, build ID, commit SHA, config version, and migration version when applicable.
3. Check migrations for forward compatibility, rollback impact, and data safety.
4. Confirm preflight signals: tests, CI, image availability, config presence, secret availability, capacity, and current health.
5. Define go/no-go criteria before execution.

## Output

- Ready, blocked, or conditional status.
- Blocking risks and evidence.
- Required approvals.
- Exact preflight and postflight checks.
