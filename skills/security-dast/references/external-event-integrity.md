# External Event Integrity

Use this for authorized runtime testing of webhooks, callbacks, queue-facing APIs, provider status endpoints, import endpoints, and reconciliation surfaces.

## Runtime Checks

- Confirm the target is explicitly allowlisted before active probing.
- Test missing or invalid authenticity proof when safe and authorized.
- Test duplicate delivery behavior when a stable test event or sandbox target exists.
- Test mismatched resource, tenant/account, reference, amount/count, currency/unit, or status only in non-production or explicit sandbox scope.
- Test scoped account, merchant, sub-account, or environment mismatch when sandbox fixtures support it.
- Check timeout, rate-limit, malformed response, and retry behavior through safe stubs or sandbox providers when available.
- When a safe provider stub is available, verify that lookup failure or mismatched returned object prevents any local success/failure state update.
- Capture request/response evidence with credentials, tokens, cookies, and PII redacted.

## Finding Rules

- Separate confirmed runtime weaknesses from sandbox limitations or unavailable provider behavior.
- Do not infer source-code behavior from one runtime response when an allowlist, WAF, or provider sandbox may be shaping the response.
- For replay, mismatch, authenticity, or pre-verification state-transition findings, include preconditions, tested payload shape, observed secure or insecure result, and retest command.
- Route source-code root-cause confirmation to `security-sast` when blackbox evidence is insufficient.
