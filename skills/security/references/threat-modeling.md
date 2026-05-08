# Threat Modeling

Use for STRIDE, OWASP/API security, trust boundaries, and exploit-path review.

## Inputs

- Assets, actors, entry points, data stores, and trust boundaries.
- Authn/authz model, sensitive routes, secrets, PII, money movement, and admin flows.
- Existing diagrams, OpenAPI specs, configs, and relevant code paths.

## Procedure

1. Map actors, assets, entry points, and privilege transitions.
2. Identify realistic spoofing, tampering, repudiation, disclosure, denial, and escalation paths.
3. Prioritize broken auth, injection, IDOR, SSRF, unsafe deserialization, insecure crypto, and secret leakage.
4. Validate each issue with code, config, logs, tests, or runtime evidence.
5. Recommend the smallest mitigation that closes the exploit path.

## Output

- Trust boundaries and high-value assets.
- Severity-ranked attack paths with preconditions.
- Mitigations and verification checks.
