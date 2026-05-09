# Repo Static Scan

Use for source-code review, auth/API/backend deep-dives, SAST runner orchestration, dependency CVE audits, supply-chain risk review, secrets scan review, and container/IaC/CI checks.

## Procedure

1. Inspect repo layout, language, dependency files, Dockerfiles, Compose, IaC, and CI config.
2. Choose the smallest read-only scanner set for the surface: Semgrep or CodeQL for code patterns, `gosec` for Go security checks, `govulncheck` for reachable Go advisories, Trivy filesystem/config/image for dependency, IaC, and image evidence, and Gitleaks or TruffleHog for secrets.
3. Review findings for reachability, configuration, runtime relevance, and exploitability before reporting.
4. Check auth middleware, authorization boundaries, API routes, input validation, SQL construction, file paths, outbound requests, SSRF guards, crypto, secret handling, logging, and container privileges.
5. Separate confirmed findings, high-confidence actionable findings, false positives, and unconfirmed scanner leads.

## SAST Runner Guidance

- Prefer existing repo scripts and CI configuration before inventing commands.
- Run scanners in read-only mode. Do not auto-fix, rewrite lockfiles, update baselines, upload results, or create issues unless explicitly approved.
- Use targeted commands when scope is narrow. Whole-repo scans are acceptable only when the user asks for broad coverage or the repo shape makes targeting unreliable.
- Capture the command, version when available, target path, timestamp, and relevant output excerpt for each scanner result.
- If a scanner is not installed, provide the exact recommended command and continue with manual review when useful.
- Present scanner plans before broad scans when the run would create many artifacts, require third-party rules, build databases, use network-backed services, or materially consume time.
- Disable telemetry when the scanner supports it. For Semgrep, include `--metrics=off` and avoid `--config auto` when the ruleset must be controlled.
- Keep generated scanner output under a named scratch/output directory. Do not scatter databases, SARIF, logs, or cloned repos into the project root unless the repo already has that convention.

Common read-only tools:

- Semgrep: code-pattern findings and custom rule checks.
- CodeQL: deeper language analysis when a database or CI result exists, or when building a database is reasonable for the repo.
- `gosec`: Go-specific insecure coding patterns.
- `govulncheck`: reachable Go vulnerability analysis.
- Trivy filesystem: dependency and secret/package signals from the repo.
- Trivy config: Dockerfile, Kubernetes, Terraform, and CI/IaC misconfiguration checks.
- Trivy image: runtime package and OS-layer vulnerability evidence when an image name, tag, digest, or local image is in scope.
- Gitleaks or TruffleHog: secrets detection across current files or git history when history scanning is explicitly in scope.

## Semgrep, CodeQL, And SARIF Notes

- Semgrep is best for fast pattern and taint checks. Prefer targeted rulesets for the detected languages, and record exact configs, target paths, and filtering criteria.
- CodeQL is best when interprocedural data flow matters. A built database is not automatically valid; check extractor errors, expected source file coverage, build logs, and language before trusting results.
- Existing CI SARIF is useful evidence. Normalize tool paths, rule IDs, severity, fingerprints, and timestamps before comparing runs.
- Zero findings is not proof of safety. Check whether the scanner had the right language, source coverage, query pack, database quality, and modeled framework sources/sinks.
- Treat third-party rules as untrusted input. Use them for leads, but confirm with code, configuration, and exploitability evidence before reporting.

## Dependency CVE Audit

- Identify manifests and lockfiles first: `go.mod`, `go.sum`, `package.json`, lockfiles, Dockerfiles, Compose, CI images, and generated dependency manifests.
- Prefer lockfile or module graph evidence over declared ranges when determining the installed version.
- Check reachability before severity escalation. For Go, prefer `govulncheck` reachability over package-only advisories when available.
- Distinguish application dependencies from runtime image packages. A CVE in an image layer needs image tag or digest evidence and runtime relevance; it is not automatically an application dependency bug.
- Mark stale, unreachable, dev-only, excluded-platform, or uninstalled advisory hits as unconfirmed unless the vulnerable code or package is actually used in the scoped artifact.
- For actionable dependency findings, include package, installed version, fixed version or mitigation, source manifest or lockfile, reachability evidence, and the safest verification command.

## Supply-Chain Risk Review

- Use this when the concern is dependency takeover, maintainer risk, package health, provenance, or malicious install behavior rather than a known CVE.
- Check direct dependencies first, then high-risk transitive dependencies that execute code at install, build, test, runtime plugin load, or native binding load time.
- Risk signals include single-maintainer control, anonymous or unreachable maintainers, archived or stale repos, no security contact, unusual install scripts, Git dependencies, low adoption for security-critical code, past compromise, broad filesystem/network behavior, or native/FFI/deserialization features.
- Separate takeover risk from confirmed vulnerability. A risky dependency may justify monitoring, pinning, replacement, provenance checks, or release gates without being a current exploitable bug.
- When network or GitHub lookups are in scope, record exact repo URL, package version, maintainer/org signal, last release or commit date, security policy evidence, and replacement recommendation if one is clear.
- Hand off broad inventory or alert reporting to `monitoring`; keep exploitability, CVSS, remediation validation, or release blocking in `security-sast`.

## Secrets Scan Review

- Redact secrets by default. Show only the file path, line, detector name, fingerprint or short stable prefix, and enough context to prove the finding without exposing the secret.
- Treat scanner hits as confirmed only when the value has secret-like entropy, a credible provider format, or surrounding code/config proves sensitive use.
- Put test fixtures, examples, dummy values, and already-redacted values in unconfirmed or false-positive notes unless evidence proves real credential risk.
- Remediation must be gated: rotate or revoke the credential, remove it from source, move future use to secret management, and verify history exposure handling. Do not perform rotation or destructive history rewrite from this skill.
- If git history cleanup is needed, print the exact proposed command and warn about coordination, backup, branch protection, and clone invalidation risks.

## Auth And API Review

- Trace the real route, middleware, principal extraction, role or permission check, service method, repository filter, and response transformer.
- Prioritize IDOR, broken object-level authorization, role confusion, missing tenant/account scope, auth bypass through alternate routes, unsafe passthroughs, callback forgery, SSRF, injection, and unsafe export/admin actions.
- Prefer repository-level or query-level scope enforcement over post-load filtering when that matches local architecture.
- Include negative controls when useful: sibling protected routes, denied role tests, owner-vs-non-owner behavior, or existing middleware that blocks the path.

## Container, IaC, And CI Review

- Check Dockerfile base image, user, capabilities, writable paths, secret mounts, build args, package manager use, exposed ports, and health checks.
- Check Compose or Kubernetes for privileged mode, host networking, host path mounts, broad environment secrets, missing resource limits, and unsafe service exposure.
- Check Terraform and cloud config for public exposure, broad IAM, unencrypted storage, weak network rules, and missing audit logs.
- Check CI for unpinned actions/images, secret exposure in logs, overly broad tokens, untrusted pull request execution, artifact leakage, and deploy gates.

## Evidence Standard

Each finding must cite a file, config key, command output, image digest, dependency version, lockfile entry, route, test, or scanner result. Scanner evidence alone is not enough for a confirmed vulnerability unless the scanner output itself proves the affected artifact and exploitability.

## Output

- Confirmed vulnerabilities.
- High-confidence actionable findings, false positives, and unconfirmed scanner leads clearly labeled.
- Minimal remediation and regression test or scanner verification.
