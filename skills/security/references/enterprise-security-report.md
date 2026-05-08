# Enterprise Security Report

Use for enterprise security reports, penetration-test reports, vulnerability reports, executive summaries, CVSS scoring, remediation roadmaps, release hardening, and retest-ready findings.

## Standards

- Use FIRST CVSS v4.0 for numeric scores and vectors. If a score is claimed, include the vector string. If CVSS does not fit, write `Risk-rated, CVSS not applicable`.
- Map application findings to CWE and OWASP ASVS when useful. Map web testing approach to OWASP WSTG language when useful.
- Treat business severity and CVSS as related but separate fields. Business severity may be higher or lower than CVSS when compensating controls, exposure, asset value, or blast radius justify it.

## Report Structure

1. Title, system, report date, version, author, classification, and handling notice.
2. Executive summary: overall risk, highest-risk themes, urgent actions.
3. Scope: included/excluded assets, test window, roles, environments, authorization.
4. Methodology: passive review, active probing, tooling, rate limits, non-destructive limits, evidence sources.
5. Assumptions, limitations, finding summary, detailed findings, remediation roadmap, retest plan, and appendices.

## Finding Summary Table

Include one row per root-cause finding:

| ID | Severity | CVSS | Confidence | Affected asset | Title | Owner | SLA | Retest |
|---|---:|---:|---|---|---|---|---|---|

Use `Critical`, `High`, `Medium`, `Low`, or `Info`. Use `Not assigned` only when the owner is genuinely unknown.

## Detailed Finding Template

Use this format for Critical and High findings. Medium and Low findings may be shorter but still need evidence, impact, remediation, and verification.

```text
FINDING #N - Title
Severity / CVSS / Confidence:
Affected asset and endpoint:
Classification / CWE / OWASP:
Evidence timestamp and source:
Executive risk:
Business and technical impact:
Reproduction:
Observed secure/insecure result:
Negative controls and scope checks:
Exploitability and preconditions:
Remediation:
Owner / SLA:
Verification:
Retest status:
```

## Evidence Rules

- Findings require concrete evidence: request/response, command output, file and line, config key, log event, screenshot reference, scanner result, or runtime observation.
- Redact secrets by default. Never print full tokens, cookies, auth headers, private keys, passwords, session IDs, API keys, customer PII, or one-time recovery material unless the user explicitly requires it for an internal report and confirms safe handling.
- Show partial identifiers only when needed to prove stability or correlation.
- Separate observed facts from inferred risk. Use wording such as `Observed:` and `Risk:` when the distinction matters.
- Label destructive, service-impacting, or privilege-changing exploit steps as `Not performed` unless the user explicitly authorized them.
- Include negative controls when they reduce ambiguity, such as patched endpoint behavior, auth-required sibling routes, non-affected versions, or repeated requests showing stability.
- Do not overclaim RCE, account takeover, data access, or privilege escalation unless the evidence proves that outcome.

## Severity Rules

- Critical: realistic path to full compromise, pre-auth RCE, broad secret exposure, privileged account takeover, material financial impact, or large regulated-data exposure.
- High: exploitable auth bypass, sensitive secret/token exposure, high-impact IDOR, meaningful SSRF, admin function exposure, or durable data integrity risk.
- Medium: meaningful weakness with stronger preconditions, lower privilege, limited data, or compensating controls.
- Low: hardening issue, limited information disclosure, weak control, or defense-in-depth gap.
- Info: useful observation without direct security impact.

Always include confidence. Use `High` only when independently verified or strongly evidenced; use `Low` for scanner output or weak signals needing confirmation.

## Remediation Roadmap

For each finding, provide the smallest remediation that closes the exploit path:

- Immediate containment: block, rotate, revoke, disable, restrict, or isolate.
- Permanent fix: code, config, infrastructure, dependency, policy, or process change.
- Verification: exact command, test, scanner rerun, log query, or manual check.
- Rollback or operational risk when remediation can break access, traffic, or integrations.
- Owner and SLA when known.

## Release Hardening

Use as a compact gate before release:

- Secrets come from secret manager or equivalent controlled storage.
- Debug endpoints are disabled or access-restricted.
- Auth and authorization protect every sensitive route.
- Security logs cover high-risk actions.
- Rollback is documented, tested, and safe for data compatibility.

## Report Style

- Write for executives first, operators second, and engineers third.
- Keep claims defensible and evidence-backed.
- Prefer short paragraphs and exact commands over broad security language.
- Do not include raw scanner dumps in the main report. Put raw output in appendices or summarize the confirmed issue.
- Sort findings by business severity, then CVSS, then practical exploitability.
