# Ansible And Semaphore

Use for Ansible Runner, Semaphore API, playbook dry runs, and approved execution workflows.

## Procedure

1. Identify inventory, playbook, role, variables, tags, target hosts, and expected idempotency.
2. Prefer dry run or check mode before mutation when supported.
3. Use Semaphore as the audit and human-facing launch boundary when it is the established operator path.
4. Require exact template, parameters, inventory, credentials, and rollback task before execution.
5. Capture job ID, logs, changed hosts, failures, and post-run verification.

## Rules

- Do not invent inventories, secrets, or host groups.
- Keep variables explicit and environment-specific.
- Treat failed or partially changed playbook runs as incidents requiring evidence capture.

## Output

- Execution plan.
- Dry-run result or reason unavailable.
- Approval requirements.
- Job evidence and verification.
