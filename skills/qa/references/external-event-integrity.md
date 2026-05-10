# External Event Integrity

Use for payment callbacks, webhooks, queue consumers, provider status updates, and reconciliation. Treat these as high-risk integrity paths.

## Acceptance Checks

- Verify source of truth before processing, acknowledging, or writing state. The event payload alone must not finalize state.
- Match canonical provider/source object ID across the event, local record, and provider/source response.
- Preserve scoped provider context during lookup: account, tenant, sub-account, merchant, environment, and credentials must come from local trusted state or config.
- Fail closed on mismatched resource ID, account, tenant, sub-account, merchant, environment, reference ID, amount or count, currency or unit, status, schema, or schema version where relevant.
- Classify provider errors without brittle string parsing when typed errors are available.
- Separate retryable and permanent failures. Bound retries and handle timeout/cancel.
- Confirm duplicate events are idempotent: repeated verified events do not double-apply effects, and duplicate events with changed payloads fail closed.
- Confirm success acknowledgement happens only after verified state change or verified idempotent no-op.

## Required Scenarios

- Valid event.
- Duplicate event.
- Missing auth.
- Resource, account/tenant/sub-account/merchant/environment, reference, amount/count, currency/unit, status, and schema mismatches.
- Wrong remote object ID.
- Scoped account or sub-account mismatch.
- Retry success.
- Retry exhaustion.
- Non-retryable provider failure.
- Timeout or cancellation.
