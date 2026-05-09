# Finding Normalization

Use when combining scanner, code review, log, cloud, or manual findings.

## Schema

- `title`: specific vulnerability statement, not a tool label.
- `affected_asset`: service, host, repo, file, image, domain, route, account, or cloud resource.
- `vulnerable_resource`: endpoint, package, config key, permission, query, path, or control.
- `source`: tool, command, log source, code review, runtime check, or human report.
- `scanner_artifact`: SARIF, JSON, log, dashboard, or report path when the source is machine-generated.
- `fingerprint`: stable rule/location/content identifier when available.
- `severity`: Critical, High, Medium, Low, Info.
- `cvss`: numeric score and vector when claimed, or `Risk-rated, CVSS not applicable`.
- `classification`: CWE, OWASP Top 10, OWASP ASVS, cloud control, or policy mapping when relevant.
- `evidence_timestamp`: when the evidence was observed.
- `confidence`: High, Medium, Low.
- `proof`: concise evidence with file, line, command output, request, response, log event, or screenshot reference.
- `executive_risk`: one-sentence business-facing risk.
- `technical_impact`: what an attacker can realistically do.
- `exploitability`: preconditions, attack path, required access, and practical limits.
- `negative_controls`: related checks that were tested and did not reproduce the issue.
- `remediation`: minimal fix, owner, priority, and deadline or SLA when known.
- `verification`: command, test, scanner rerun, config check, or runtime request that proves the fix.
- `retest_status`: Not retested, Passed, Failed, or Partially fixed.

## Rules

- Do not merge unrelated vulnerabilities into one finding.
- Deduplicate the same root cause across tools.
- For SARIF, normalize `ruleId`, `level`, `message`, `artifactLocation.uri`, `region.startLine`, and fingerprints before deduplication.
- Path-only matching is weak; prefer fingerprints or rule plus normalized relative path plus code context.
- Mark unverified scanner output as unconfirmed.
- Preserve exploitability context when deduplicating; the same CVE can have different severity in different deployments.
- Redact secrets, tokens, cookies, auth headers, private keys, and customer data by default.
- Separate confirmed evidence from inferred risk.
- Prefer concise operator-ready summaries over raw scanner dumps.
- For enterprise reports, normalize into `enterprise-security-report.md` before writing final findings.
