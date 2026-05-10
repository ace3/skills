# External Event Integrity

Use for authorized blackbox tests of payment callbacks, webhooks, provider status updates, queue ingress, and reconciliation endpoints. Treat these as high-risk integrity paths.

## Dynamic Checks

- Verify processing depends on source-of-truth confirmation before success acknowledgement or state change, not only event payload claims.
- Confirm canonical provider/source object IDs match across event, local record, and provider/source response when evidence is observable.
- Confirm scoped provider context is preserved during lookup: account, tenant, sub-account, merchant, and environment.
- Expect fail-closed behavior for mismatched resource ID, account, tenant, sub-account, merchant, environment, reference ID, amount or count, currency or unit, status, schema, or schema version where relevant.
- Separate retryable and permanent provider failures. Bound retries and handle timeout/cancel.
- Confirm duplicate events are idempotent: repeated verified events do not double-apply effects, and duplicate events with changed payloads fail closed.
- Redact credentials, signatures, cookies, tokens, PII, and provider secrets from request/response evidence.

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

Run active mismatch or replay tests only against explicit allowlisted targets and test accounts.
