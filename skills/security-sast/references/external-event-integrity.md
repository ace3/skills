# External Event Integrity

Use this for whitebox review of webhooks, callbacks, queues, provider status updates, reconciliation jobs, scheduled sync, imports, and any flow where another system tells this system what happened.

## Review Targets

- Source of truth: local state, provider lookup, signed payload, event stream offset, or reconciliation table.
- Authenticity: signature, token, mTLS, IP allowlist, service identity, or remote fetch confirmation.
- Idempotency: event ID, provider transaction ID, idempotency key, aggregate ID plus version, or message offset.
- Mismatch handling: actor/account/tenant, resource ID, reference ID, amount/count, currency/unit, status, timestamp, schema version, or environment.
- Verification sequencing: source-of-truth checks must complete before local state transitions, callback processing, or success/failure writes derived from the event.
- Scoped provider context: account, tenant, merchant, sub-account, and environment-specific clients or credentials must be preserved during verification.
- Failure handling: timeout, 429, 5xx, malformed response, unknown status, context cancellation, out-of-order event, or stale event.
- Observability: correlation IDs, mismatch reasons, audit trail, and secret redaction.

## Security Expectations

- Do not trust client-supplied success states without provider-supported verification.
- Validate identity and ownership before state transition.
- If remote verification is used, require exact returned-object identity match before checking secondary fields.
- Treat global/default provider-client lookup on a scoped callback path as a likely security regression.
- Separate retryable provider errors from permanent failures using typed status or classified errors.
- Flag string-matched retry classification when typed status, sentinel errors, or provider error classes are available.
- Keep state transitions monotonic unless there is an explicit correction or reversal path.
- Fail closed on authenticity, ownership, schema, amount/count, currency/unit, or environment mismatch.
- Treat missing tests for replay, mismatch, and duplicate event handling as a material gap on T0/T1 paths.
