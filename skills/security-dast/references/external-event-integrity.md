# External Event Integrity

Use for authorized blackbox tests of payment callbacks, webhooks, provider status updates, queue ingress, and reconciliation endpoints.

## Dynamic Checks

- Verify processing depends on source-of-truth confirmation, not only event payload claims.
- Confirm canonical IDs match across event, local record, and provider or source response when evidence is observable.
- Preserve scoped provider context during lookup: account, tenant, sub-account, merchant, and environment.
- Expect fail-closed behavior for mismatched resource ID, scoped account, reference ID, amount or count, currency or unit, status, or schema.
- Separate retryable and permanent provider failures. Bound retries and handle timeout/cancel.
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
