---
name: security
description: >
  Security operations skill for threat modeling, code and config audits,
  active surface scanning, log threat hunting, finding normalization, and
  enterprise security reporting, penetration-test reports, vulnerability
  reports, executive summaries, CVSS scoring, remediation plans, and release
  hardening gates. Use when a task impacts authentication, authorization,
  secrets, data protection, external exposure, or integrity.
---

# Security

Use this skill to produce evidence-backed security work with minimal safe remediation. Keep the main context small; load only the reference that matches the task.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. Classify the task, state assumptions and ambiguity, choose the simplest sufficient path, keep changes surgical, and define verification before action. Read-only checks may proceed after classification. Design or behavior changes require brainstorming or an equivalent written design. Privileged security changes require an exact plan, approval, rollback notes, and post-change verification.

## Classify First

- Passive review: code, config, dependency, image, IaC, DNS record, log, or audit evidence already available.
- Active scan: network, web, TLS, endpoint, or attack-surface probing against an explicit allowlist.
- Privileged change: any remediation, service change, credential change, DNS change, or deploy action.

## Load References

- Threat model, API security, OWASP, trust boundaries, or exploit paths: `references/threat-modeling.md`.
- Go/backend, Semgrep, CodeQL, `govulncheck`, Trivy repo/image/IaC scanning: `references/repo-static-scan.md`.
- Amass, Naabu, httpx, ffuf, ZAP, Nuclei, or SSLyze: `references/active-surface-scan.md`.
- Sigma rules, Linux/GCP/Docker/Nginx logs, or forensic evidence: `references/log-threat-hunt.md`.
- Multi-tool reports or triage output: `references/finding-normalization.md`.
- Enterprise security report, penetration-test report, vulnerability report, executive summary, CVSS scoring, or remediation roadmap: `references/enterprise-security-report.md`.
- Release hardening gates: `references/release-hardening-checklist.md`.

## Rules

- Findings require concrete evidence, not speculation.
- Active scans require allowlisted targets, rate limits, and non-production preference unless approved.
- Privileged changes require explicit approval and rollback notes.
- Prefer fail-closed behavior when uncertainty affects auth, secrets, money, or integrity.

## Output Contract

Findings first, highest severity first. Include target, severity, evidence, exploitability, remediation, verification, and retest status. For enterprise reports, start with an executive summary and finding table before detailed findings.
