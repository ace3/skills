# Repo Static Scan

Use for Go/backend security review, Semgrep/CodeQL patterns, `govulncheck`, and Trivy repo/image/IaC checks.

## Procedure

1. Inspect repo layout, language, dependency files, Dockerfiles, Compose, IaC, and CI config.
2. Run or recommend targeted scanners only when appropriate: `govulncheck`, Semgrep, CodeQL, Trivy filesystem, Trivy image, and Trivy config.
3. Review findings for reachability and exploitability before reporting.
4. Check auth middleware, input validation, SQL construction, file paths, outbound requests, crypto, secrets, and container privileges.
5. Separate confirmed findings from scanner noise.

## Evidence Standard

Each finding must cite a file, config key, command output, image digest, dependency version, or scanner result.

## Output

- Confirmed vulnerabilities.
- False positives or low-confidence items clearly labeled.
- Minimal remediation and regression test or scanner verification.
