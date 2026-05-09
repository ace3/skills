# JavaScript Web Runtime Scan

Use for authorized blackbox testing of deployed or local Next.js, Node.js, TypeScript, React, GraphQL, and modern JavaScript web applications.

## Safety Gate

Do not probe a JavaScript web target until the allowed hosts, base paths, environments, accounts, rate limits, exclusions, and stop conditions are explicit. Prefer staging or local targets. Keep payloads non-destructive, redact credentials and PII, and do not test denial of service, brute force, destructive state changes, credential stuffing, or broad crawling outside the allowlist.

## Procedure

1. Build a target inventory from the allowlist, supplied URLs, route docs, OpenAPI or GraphQL schemas, browser-observed requests, and known framework paths.
2. Capture passive evidence first: redirects, cookies, storage, security headers, CORS, CSP, `_next` assets, source maps, API routes, forms, GraphQL endpoints, and client-side route transitions.
3. Use active probes only inside scope: browser observation, httpx, ffuf, ZAP, Nuclei, SSLyze, GraphQL introspection checks, and small manual request sets.
4. Test auth and input behavior with low-impact requests and negative controls.
5. Normalize scanner output, confirm exploitability or operational relevance, and state untested gaps clearly.

## Surface Mapping

- Next.js: root routes, `/_next/static/`, image optimizer paths, middleware redirects, API routes, route handlers, server-action endpoints, metadata/image routes, rewrites, redirects, preview/draft mode, and exported static assets.
- Node APIs: Express/Fastify/Nest routes, health/debug endpoints, static directories, uploaded files, generated docs, OpenAPI/Swagger, GraphQL, tRPC, webhooks, and admin paths.
- Browser state: cookies, local/session storage, IndexedDB, service workers, cache storage, CSP reports, client-side API calls, source maps, and error telemetry endpoints.
- Deployment layer: CDN headers, cache keys, compression, TLS, HSTS, redirect chains, CORS preflight, proxy headers, host header behavior, and environment-specific exposure.

## Test Areas

- Authentication: login/logout, session fixation, token refresh, cookie flags, OAuth callback state, password reset, account enumeration, role-specific pages, and fresh-browser replay with redacted tokens.
- Authorization: IDOR, tenant/account scoping, admin-only routes, alternate API paths, method overrides, GraphQL object access, and client-hidden operations.
- Client/server boundary: secrets or PII in HTML, hydration data, JavaScript bundles, source maps, public runtime config, `NEXT_PUBLIC_*` values, and browser storage.
- Input validation: reflected or stored XSS signals, JSON/body parser edge cases, path traversal, open redirect, SSRF-like URL inputs, upload handling, GraphQL variables, NoSQL/SQL error behavior, and parameter tampering.
- Cache and headers: user-specific response caching, CDN cache poisoning, missing private/no-store headers, CORS overexposure, CSP gaps, clickjacking, HSTS, MIME sniffing, and permissive referrer policy.
- Supply-chain exposure: public source maps, leaked package metadata, exposed build IDs, debug artifacts, test fixtures, CI artifacts, or package registry tokens in client-visible assets.

## Scanner Guidance

- Browser automation is preferred when the app depends on client-side routing or JavaScript-generated requests.
- Use ZAP or Nuclei as evidence sources, not final authority. Confirm findings with a safe request, browser observation, config evidence, or repeatable negative control.
- Keep fuzzing narrow: scoped paths, low concurrency, short wordlists, and explicit exclusions for logout, payment, admin mutation, email-sending, and destructive endpoints.
- For GraphQL, prefer schema and introspection checks, authorization checks across object IDs, query depth/complexity observations, and error disclosure. Do not run expensive recursive queries.
- For cache findings, prove the affected cache key, headers, user variance, and negative control without exposing another user's data.

## Evidence Standard

Each finding must include target URL or route, method, role or auth state, redacted request details, observed response, timestamp, reproduction confidence, negative control when useful, and a safe verification step. Do not include weaponized exploit payloads or instructions for public attack.

## Output

- Scope and scan controls used.
- Tested routes, APIs, forms, auth entry points, client storage, headers, and notable exclusions.
- Findings with proof, severity, confidence, exploitability, remediation, verification, and retest status.
- Run closeout: scope assessed, candidates processed, findings confirmed, false positives, fixes made, revalidation, residual risks, and follow-up gates.
