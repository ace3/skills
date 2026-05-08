# Active Surface Scan

Use for authorized blackbox web/API assessment, OWASP-style dynamic testing, retest evidence, and allowlisted Amass, Naabu, httpx, ffuf, ZAP, Nuclei, and SSLyze workflows.

## Safety Gate

Do not run active probing unless the target scope is explicit and authorized. Prefer staging. Use low concurrency, rate limits, scanner identity headers, excluded targets, stop conditions, and maintenance windows for sensitive systems.

Stay inside the allowlist. Do not perform destructive exploit steps, denial-of-service tests, brute force, mass registration, credential stuffing, broad crawling outside scope, or privilege-changing actions unless the user gives explicit written approval for that exact action. Redact credentials, tokens, cookies, auth headers, private keys, and PII from evidence by default.

## Procedure

1. Confirm allowed domains, CIDRs, environments, ports, and excluded targets.
2. Start passive inventory from owned DNS, cloud APIs, repo config, or known endpoints.
3. Use active discovery only inside scope: Amass for asset mapping, Naabu for ports, httpx for HTTP probing, ffuf for paths/params, ZAP for API/web scanning, Nuclei for templates, SSLyze for TLS.
4. Normalize tool output before triage.
5. Report only exploitable or operationally relevant findings.

## Blackbox Engagement Loop

### Phase 1: Recon And Surface Mapping

- Build the allowed target inventory: hosts, ports, protocols, base paths, known roles, test accounts, and excluded assets.
- Capture reachable routes, redirects, forms, inputs, API calls, cookies, local storage signals, CORS behavior, TLS state, and security headers.
- Use browser-driven observation when a UI exists: load pages, wait for network idle, capture screenshots when useful, and record network requests without assuming source access.
- Produce a surface inventory: route or endpoint, method, auth required, inputs, observed responses, client storage, and evidence source.

### Phase 2: Authentication Attack Surface

- Identify login, logout, registration, password reset, session refresh, OAuth, SSO, MFA, and admin entry points.
- Test only low-impact auth behaviors unless stronger testing is explicitly approved: invalid credentials, logout invalidation, session token rotation after login, account enumeration through timing or error differences, missing auth on known sensitive routes, and token replay with redacted tokens.
- Document preconditions for every auth finding, including required role, account state, token age, and whether the issue was reproduced from a fresh browser context.

### Phase 3: Input Validation And Injection Probing

- For each scoped input, choose small payload sets that match the surface: SQL injection, reflected/stored XSS, SSRF, path traversal, open redirect, header injection, Host header manipulation, JSON/body parser edge cases, and parameter tampering.
- Keep probes non-destructive. Do not use payloads intended to drop data, alter persistent state, overload services, or exfiltrate real secrets.
- Record endpoint, method, payload class, redacted request details, status code, response difference, timing difference when relevant, and negative controls.

### Phase 4: Threat Mapping

- Map confirmed or high-confidence findings to OWASP Web/API Top 10, CWE, OWASP ASVS, or WSTG where useful.
- Assign severity from realistic impact, reachability, required access, affected asset value, compensating controls, and reproduction confidence.
- Translate each finding into acceptance-style verification: what must be true after remediation, which request proves it, and which sibling route or role should remain unaffected.

### Phase 5: Reporting And Retest

- Start with tested scope, scan controls, surface stats, and overall risk.
- Sort findings by business severity, then exploitability, then confidence. Use either P0/P1/P2/P3 or Critical/High/Medium/Low consistently in one report.
- For each finding, include title, classification, severity, affected target, evidence timestamp, proof, reproduction, exploitability, remediation, verification, and retest status.
- State gaps clearly: no credentials, authenticated areas not tested, JavaScript routes not reached, scanner-only signals, rate limits encountered, or source code unavailable.

## Output

- Scope and scan controls used.
- Targets tested and tools used.
- Tested surface stats: routes, forms, API endpoints, auth entry points, and notable exclusions when known.
- Findings with proof, severity, confidence, exploitability, remediation, verification, and retest status.
