# Threat Modeling

Use for STRIDE, OWASP/API security, trust boundaries, exploit-path review, and security test-case generation.

## Inputs

- Assets, actors, entry points, data stores, and trust boundaries.
- Authn/authz model, sensitive routes, secrets, PII, money movement, and admin flows.
- Existing diagrams, OpenAPI specs, configs, and relevant code paths.

## Procedure

1. Map actors, assets, entry points, and privilege transitions.
2. Identify realistic spoofing, tampering, repudiation, disclosure, denial, and escalation paths.
3. Prioritize broken auth, injection, IDOR, SSRF, unsafe deserialization, insecure crypto, and secret leakage.
4. Convert realistic attack paths into security test cases with preconditions, action, expected secure result, evidence source, and automation target.
5. Validate each issue with code, config, logs, tests, or runtime evidence.
6. Recommend the smallest mitigation that closes the exploit path.

## STRIDE To Test Cases

For each meaningful threat, produce a test case only when it can be tied to a real entry point or control:

```text
Threat:
Asset and boundary:
Actor and preconditions:
Attack path:
Expected secure behavior:
Test type: unit, integration, scanner, config check, manual review, or runtime request
Evidence needed:
Mitigation:
Verification:
```

Use these mappings:

- Spoofing: auth bypass, weak callback verification, token confusion, missing issuer/audience checks, service-to-service identity gaps.
- Tampering: unsafe state transitions, unsigned callbacks, missing idempotency, unscoped updates, request body trust, data integrity gaps.
- Repudiation: missing audit log for sensitive action, weak actor attribution, missing request correlation for admin or money movement.
- Information disclosure: IDOR, overbroad response, secret logging, unsafe export, excessive error detail, storage or cache exposure.
- Denial of service: unbounded query, missing rate or size limit, expensive unauthenticated route, retry storm, lock contention.
- Elevation of privilege: role confusion, tenant/account scope bypass, admin route exposure, permission check drift between routes.

## Quick Checklist

- Assets, actors, trust boundaries, entry points, and privilege transitions are explicit.
- STRIDE risks are tied to realistic paths and preconditions.
- Each actionable threat has at least one security test case or a reason it cannot be tested from the available evidence.
- Mitigations have test, config, runtime, or control verification.

## Output

- Trust boundaries and high-value assets.
- Severity-ranked attack paths with preconditions.
- Security test cases grouped by threat or route.
- Mitigations and verification checks.
