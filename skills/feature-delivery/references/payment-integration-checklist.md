# Payment Integration Checklist

Use this reference for payment gateways, payment provider callbacks, checkout flows, refunds, reconciliation, or money movement. Xendit-style integrations should satisfy these checks unless the repo already has an equivalent pattern.

## Planning Checks

- Provider config: environment variables, sandbox/live separation, base URLs, public vs secret keys, and redaction.
- Data ownership: local transaction/payment records, provider IDs, merchant references, user/account ownership, and reconciliation source of truth.
- State model: pending, succeeded, failed, expired, canceled, refunded, partial refund, and unknown/provider-error states as applicable.
- Idempotency: client request idempotency, provider request idempotency, callback idempotency, retry-safe database writes.
- Compatibility: old and new code overlap, migration order, fallback behavior, and rollback limits.

## Callback And Webhook Checks

- Verify callback authenticity with the repo's provider-supported method: signature, token, allowlist, or remote fetch confirmation.
- Reject or quarantine callbacks with mismatched amount, currency, payment ID, merchant reference, account, or status.
- Protect against replay with idempotent state transitions and durable processed-event tracking when available.
- Treat callbacks as at-least-once delivery.
- Do not trust client-supplied success states.
- Log enough context to audit without leaking secrets or full payment credentials.

## Failure Handling

- Network timeouts and provider 5xx responses must not create duplicate charges.
- Ambiguous provider responses should move to pending/reconciliation, not success.
- Retries must use stable idempotency keys.
- Local state transitions should be monotonic unless an explicit correction/reversal path exists.
- Background reconciliation should repair uncertain states when the system already supports it.

## Test Expectations

- Unit tests for request construction, config validation, and state transition rules.
- Callback tests for valid, duplicate, forged, mismatched, stale, and out-of-order events.
- Integration or contract tests around provider client boundaries when the repo pattern supports it.
- Regression tests for duplicate payment prevention and retry behavior.
- Security review evidence for secrets, callback trust, replay, authz, and amount/currency consistency.

## Stop Gates

Stop before using real payment credentials, making live provider calls, mutating production payment records, running destructive migration commands, or choosing business rules that affect money movement without user confirmation.
