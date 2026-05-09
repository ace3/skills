# External Event Integrity

Use for payment callbacks, webhooks, queue consumers, provider status updates, and reconciliation.

## Acceptance Checks

- Verify source of truth before processing, acknowledging, or writing state.
- Match canonical ID across the event, local record, and provider or source response.
- Preserve scoped provider context during lookup: account, tenant, sub-account, merchant, and environment.
- Fail closed on mismatched resource ID, scoped account, reference ID, amount or count, currency or unit, status, or schema.
- Classify provider errors without brittle string parsing when typed errors are available.
- Separate retryable and permanent failures. Bound retries and handle timeout/cancel.
- Confirm duplicate events are idempotent and do not double-apply effects.

## Required Scenarios

- Valid event.
- Duplicate event.
- Missing auth.
- Resource, reference, amount/count, currency/unit, status, and schema mismatches.
- Wrong remote object ID.
- Scoped account or sub-account mismatch.
- Retry success.
- Retry exhaustion.
- Non-retryable provider failure.
- Timeout or cancellation.
