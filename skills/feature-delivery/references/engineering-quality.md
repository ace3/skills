# Engineering Quality

Use this reference for non-trivial implementation work in any language or framework.

## Quality Bar

- State the invariant before changing behavior: what must always remain true after the change.
- Name the failure mode: timeout, retry exhaustion, duplicate event, partial write, stale read, missing permission, malformed input, schema mismatch, or downstream outage.
- Keep boundaries explicit: transport, service/domain, repository/storage, provider/client, queue/worker, scheduler, and UI code should not silently absorb each other's responsibilities.
- Prefer typed contracts and typed errors where callers need to branch on behavior. Avoid parsing error strings for control flow.
- Make retries bounded and classifiable. Separate retryable failures from permanent validation, authorization, or not-found failures.
- Make external events idempotent. Define duplicate-event behavior before writing state.
- Make ambiguous external responses safe. Unknown status, timeout, or schema mismatch should not become success unless the existing domain contract says so.
- Add observable evidence for risky paths: structured logs, error wrapping, metrics, traces, or audit fields that let an operator diagnose the failure without exposing secrets.

## Implementation Checks

- Inspect existing entrypoints, interfaces, config, tests, and error patterns before editing.
- Choose the smallest implementation slice that closes the requested behavior.
- Reuse local helpers for validation, logging, transactions, time, decimal/money, retries, and provider clients.
- Keep public API, schema, proto, and event contract changes backward compatible unless the approved plan says otherwise.
- Keep data writes atomic where a partial write would violate an invariant.
- Prefer tests through public or stable package interfaces over tests that freeze private helper structure.

## Finish Criteria

- Core invariant has a test or a stated blocked reason.
- Each meaningful failure mode has handling, a test, or an explicit accepted gap.
- Verification uses repo-native commands where available.
- Remaining risk is specific enough for QA or the next owner to retest.
