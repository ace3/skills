---
name: security-sast
description: >
  Whitebox/static application security testing for source code, config,
  dependencies, containers, IaC, CI, threat modeling, scanner-output review,
  finding normalization, vulnerability reports, CVSS scoring, remediation
  plans, fix queue handoffs, and release hardening. Use for SAST, Semgrep,
  CodeQL, govulncheck, Trivy filesystem/image/config scans, auth reviews,
  secrets, data protection, money movement, or integrity-sensitive code.
---

# Security SAST

Produce evidence-backed whitebox security work with the smallest safe remediation. Load the base layer, then only task-relevant references.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. It defines assumptions, simplicity, surgical scope, planning gates, destructive-command handling, and verification.

## Classify

- Static review: code, config, dependency, image, IaC, CI, generated artifact, or scanner evidence already available.
- Threat model: assets, actors, trust boundaries, entry points, and privilege transitions backed by repo or architecture evidence.
- Privileged change: any remediation, service change, credential change, DNS change, or deploy action.

## References

- Threat model, API security, OWASP, trust boundaries, exploit paths, or threat-model checklist: `references/threat-modeling.md`.
- Go/backend review, Semgrep, CodeQL, `govulncheck`, Trivy, repo/image/IaC scanning: `references/repo-static-scan.md`.
- Multi-tool triage, deduplication, severity, confidence, or retest state: `references/finding-normalization.md`.
- Enterprise report, pentest report, vulnerability report, CVSS, roadmap, or release hardening: `references/enterprise-security-report.md`.
- Security finding handoff to `em-thinking`, `golang-developer`, or `deployment-ops`: `references/security-fix-queue.md`.
- Researching, benchmarking, or improving this skill: `references/self-improvement-loop.md`.

## Rules

- Findings require concrete evidence, not speculation.
- Do not run blackbox or active probing from this skill; use `security-dast` for allowlisted runtime target testing.
- Privileged changes require explicit approval and rollback notes.
- Do not execute destructive commands. Print the exact command for the user to run, explain impact and rollback or recovery limits, then wait for the result.
- Prefer fail-closed behavior when uncertainty affects auth, secrets, money, or integrity.

## Output Contract

Findings first, highest severity first. Include target, severity, evidence, exploitability, remediation, verification, and retest status. For enterprise reports, start with an executive summary and finding table before detailed findings.

When the requested output is a fix handoff, emit a Security Fix Queue Bundle using `references/security-fix-queue.md`. The bundle is Markdown with an embedded strict JSON block. Route code findings to `em-thinking`, then `golang-developer`; route infra, runtime, deployment, DNS, image, load balancer, service operation, or rollout findings to `deployment-ops`. Only confirmed or high-confidence actionable findings belong in `fix_queue`; weak scanner output belongs in `unconfirmed_findings`.
