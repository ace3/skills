---
name: security-dast
description: >
  Blackbox/dynamic application security testing for authorized runtime targets,
  active surface scans, API/web probing, TLS checks, fuzzing, pentest-style
  validation, finding normalization, enterprise security reports, penetration
  test reports, vulnerability reports, CVSS scoring, remediation plans, and
  retest evidence. Use for DAST, ZAP, Nuclei, SSLyze, Naabu, httpx, ffuf,
  Amass, external exposure, domains, URLs, APIs, ports, or deployed services.
---

# Security DAST

Produce evidence-backed blackbox security work with the smallest safe remediation. Load the base layer, then only task-relevant references.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. It defines assumptions, simplicity, surgical scope, planning gates, destructive-command handling, and verification.

## Classify

- Passive target review: supplied domains, URLs, API specs, known routes, scanner output, screenshots, or runtime evidence.
- Active scan: network, web, TLS, endpoint, fuzzing, or attack-surface probing against an explicit allowlist.
- Privileged change: any remediation, service change, credential change, DNS change, or deploy action.

## References

- Amass, Naabu, httpx, ffuf, ZAP, Nuclei, SSLyze, or active scan planning: `references/active-surface-scan.md`.
- Multi-tool triage, deduplication, severity, confidence, or retest state: `references/finding-normalization.md`.
- Enterprise report, pentest report, vulnerability report, CVSS, roadmap, or release hardening: `references/enterprise-security-report.md`.
- Security finding handoff to `em-thinking`, `golang-developer`, or `deployment-ops`: `references/security-fix-queue.md`.
- Researching, benchmarking, or improving this skill: `references/self-improvement-loop.md`.

## Rules

- Findings require concrete evidence, not speculation.
- Active scans require allowlisted targets, rate limits, and non-production preference unless approved.
- Do not perform whitebox source, dependency, container, or IaC review from this skill; use `security-sast` for repository and artifact analysis.
- Privileged changes require explicit approval and rollback notes.
- Do not execute destructive commands. Print the exact command for the user to run, explain impact and rollback or recovery limits, then wait for the result.
- Prefer fail-closed behavior when uncertainty affects auth, secrets, money, or integrity.

## Output Contract

Findings first, highest severity first. Include target, severity, evidence, exploitability, remediation, verification, and retest status. For enterprise reports, start with an executive summary and finding table before detailed findings.

When the requested output is a fix handoff, emit a Security Fix Queue Bundle using `references/security-fix-queue.md`. The bundle is Markdown with an embedded strict JSON block. Route code findings to `em-thinking`, then `golang-developer`; route infra, runtime, deployment, DNS, image, load balancer, service operation, or rollout findings to `deployment-ops`. Only confirmed or high-confidence actionable findings belong in `fix_queue`; weak scanner output belongs in `unconfirmed_findings`.
