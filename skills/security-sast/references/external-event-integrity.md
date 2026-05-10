# External Event Integrity

Use for payment callbacks, webhooks, queue consumers, provider status updates, and reconciliation. Treat these as high-risk integrity paths.

## Security Invariants

- Verify the source of truth before processing, acknowledging, or writing state. The event payload alone is not source-of-truth for final state.
- Use the provider/source immutable object ID as canonical ID when available. Match it across the event, local record, and provider/source response.
- Preserve scoped provider context during remote lookup: account, tenant, sub-account, merchant, environment, and credentials must come from the local integration record or trusted config, not event payload alone.
- Fail closed on mismatched resource ID, account, tenant, sub-account, merchant, environment, reference ID, amount or count, currency or unit, status, schema, or schema version where relevant.
- Classify provider errors with typed contracts when possible. Avoid string parsing for retry decisions.
- Separate retryable and permanent failures. Use bounded retries with timeout, cancellation, and backoff. Permanent mismatches must not retry into success.
- Make duplicates idempotent: same event and same verified state returns the existing result without new side effects; changed duplicate payload fails closed.

## Review Focus

- Trace event entrypoint to auth, local lookup, scoped remote verification, comparison, state transition, acknowledgement, retry, dead-letter, and audit logging.
- Confirm remote lookup uses the same scoped provider context as the original local record or integration account.
- Check that success acknowledgement happens only after verified state change or verified idempotent no-op.
- Treat event-only state transitions, ID-only trust, cross-tenant lookup, unbounded retry, string-parsed provider errors, ambiguous provider errors, and duplicate side effects as high-risk findings.
- Require tests for valid event, duplicate event, missing auth, mismatches, wrong remote object ID, scoped account/sub-account mismatch, retry success, retry exhaustion, non-retryable failure, and timeout/cancel.
