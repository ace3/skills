# Rollback Verification

Use for rollback triggers, previous artifact checks, rollback execution plans, and post-rollback real-path verification.

## Procedure

1. Define rollback triggers before rollout starts.
2. Confirm previous stable artifact, config, template, migration compatibility, and command path.
3. Capture current state before rollback for audit and diagnosis.
4. Execute rollback only after approval unless the runbook already grants emergency authority.
5. Verify real request path first, then backend health, logs, metrics, and data consistency.

## Rollback Gate

- Trigger thresholds are predefined.
- Previous stable artifact is available.
- Rollback command path is tested.
- Data compatibility is validated before rollback.
- Post-rollback checks confirm recovery.

## Output

- Rollback trigger and evidence.
- Rollback command or API diff.
- Expected recovery signal.
- Post-rollback verification result.
- Follow-up remediation and incident notes.
