# External Event Integrity

Use for payment callbacks, webhooks, queue consumers, provider status updates, and reconciliation.

## Security Invariants

- Verify the source of truth before processing, acknowledging, or writing state.
- Match the canonical ID across the event, local record, and provider or source response.
- Preserve scoped provider context during lookup: account, tenant, sub-account, merchant, and environment.
- Fail closed on mismatched resource ID, scoped account, reference ID, amount or count, currency or unit, status, or schema.
- Classify provider errors with typed contracts when possible. Avoid string parsing for retry decisions.
- Separate retryable and permanent failures. Use bounded retries with timeout and cancellation handling.
- Make duplicates idempotent: same event and same verified state should not double-apply effects.

## Review Focus

- Trace event entrypoint to auth, local lookup, remote verification, state transition, acknowledgment, retry, and audit logging.
- Confirm remote lookup uses the same scoped provider context as the original local record or integration account.
- Treat event-only state transitions, ID-only trust, cross-tenant lookup, unbounded retry, and ambiguous provider errors as high-risk findings.
- Require tests for valid event, duplicate event, missing auth, mismatches, wrong remote object ID, scoped account/sub-account mismatch, retry success, retry exhaustion, non-retryable failure, and timeout/cancel.
