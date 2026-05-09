# External Event Integrity

Use this for webhooks, callbacks, queues, provider status updates, reconciliation jobs, scheduled sync, imports, and any flow where another system tells this system what happened.

## Required Questions

- What is the source of truth: local state, provider lookup, signed payload, event stream offset, or reconciliation table?
- How is authenticity verified: signature, token, mTLS, IP allowlist, service identity, or remote fetch confirmation?
- What makes the event unique: event ID, provider transaction ID, idempotency key, aggregate ID plus version, or message offset?
- What is duplicate-event behavior: no-op, replay same response, retry current state, or reject?
- What mismatches must fail closed: actor/account/tenant, resource ID, reference ID, amount/count, currency/unit, status, timestamp, schema version, or environment?
- Does the verification path preserve the event's account, tenant, merchant, sub-account, or environment context when calling the source of truth?
- What happens on timeout, 429, 5xx, malformed response, unknown status, or context cancellation?

## Implementation Rules

- Validate identity and ownership before state transition.
- Complete source-of-truth verification before processing, acknowledging, or writing any success/failure state derived from the event.
- If remote verification is used, compare the returned object identity to the event identity and the local record before trusting any other fields.
- Preserve scoped provider clients and credentials. Do not replace account, tenant, merchant, sub-account, or environment-aware lookups with a global default client.
- Separate retryable provider errors from permanent failures using typed status or classified errors.
- Do not parse error strings to decide retry behavior when a status code, sentinel error, or typed provider error can be exposed.
- Keep state transitions monotonic unless there is an explicit correction or reversal path.
- Acknowledge external delivery only after durable processing when the protocol allows it.
- Avoid trusting client-supplied success states without provider-supported verification.
- Log correlation identifiers and mismatch reasons without logging secrets or full credentials.

## Test Expectations

- Valid event.
- Duplicate event.
- Missing or invalid authenticity proof.
- Mismatched resource, tenant/account, reference, amount/count, currency/unit, or status.
- Remote lookup returns a different object ID than the event's canonical ID.
- Scoped provider account, tenant, merchant, sub-account, or environment differs from the local record.
- Provider timeout, retry success, retry exhaustion, rate limit, and non-retryable error.
- Context cancellation or shutdown.
- Out-of-order or stale event when ordering matters.
