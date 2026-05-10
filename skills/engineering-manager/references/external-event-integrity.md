# External Event Integrity

Use for payment callbacks, webhooks, queue consumers, provider status updates, and reconciliation. Treat these as high-risk integrity paths.

## Required Invariants

- Verify the source of truth before processing, acknowledging, or writing state. The event payload alone is not source-of-truth for final state.
- Use the provider/source immutable object ID as canonical ID when available. Match it across the event, local record, and provider/source response.
- Preserve scoped provider context during remote lookup: account, tenant, sub-account, merchant, environment, and credentials must come from the local integration record or trusted config, not event payload alone.
- Fail closed on mismatched resource ID, account, tenant, sub-account, merchant, environment, reference ID, amount or count, currency or unit, status, schema, or schema version where relevant.
- Classify provider errors with typed contracts when possible. Avoid string parsing for retry decisions.
- Separate retryable and permanent failures. Use bounded retries with timeout, cancellation, and backoff. Permanent mismatches must not retry into success.
- Make duplicates idempotent: same event and same verified state returns the existing result without new side effects; changed duplicate payload fails closed.

## Plan Requirements

- Name the entrypoint, auth check, local source of record, remote source of truth, state transition owner, and acknowledgement boundary.
- Define the canonical ID and every compared field: resource ID, scoped account fields, reference ID, amount/count, currency/unit, status, and schema.
- Specify outcomes for verified event, duplicate event, missing auth, mismatch, wrong remote object, scoped account mismatch, retryable provider failure, permanent provider failure, retry exhaustion, and timeout/cancel.
- Require scoped remote lookup before mutation or acknowledgement. Acknowledge success only after a verified transition or verified idempotent no-op.
- Define retry limits, backoff, timeout, cancellation, transaction boundary, audit log, and operator-visible evidence.
- Require tests for valid event, duplicate event, missing auth, mismatches, wrong remote object ID, scoped account/sub-account mismatch, retry success, retry exhaustion, non-retryable failure, and timeout/cancel.
