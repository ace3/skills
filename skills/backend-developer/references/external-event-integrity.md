# External Event Integrity

Use for payment callbacks, webhooks, queue consumers, provider status updates, and reconciliation.

## Invariants

- Verify the source of truth before processing, acknowledging, or writing state.
- Match the canonical ID across the event, local record, and provider or source response.
- Preserve scoped provider context during lookup: account, tenant, sub-account, merchant, and environment.
- Fail closed on mismatched resource ID, scoped account, reference ID, amount or count, currency or unit, status, or schema.
- Classify provider errors with typed contracts when possible. Avoid string parsing for retry decisions.
- Separate retryable and permanent failures. Use bounded retries with timeout and cancellation handling.
- Make duplicates idempotent: same event and same verified state should not double-apply effects.

## Implementation Requirements

- Load local state first, then perform scoped remote lookup before mutation or acknowledgment.
- Compare event, local state, and remote response using typed fields and canonical IDs.
- Persist only verified transitions. Treat unknown, ambiguous, or mismatched state as rejected or retryable based on typed error class.
- Keep provider context attached across service, provider client, queue, worker, and reconciliation paths.
- Add tests for valid event, duplicate event, missing auth, mismatches, wrong remote object ID, scoped account/sub-account mismatch, retry success, retry exhaustion, non-retryable failure, and timeout/cancel.
