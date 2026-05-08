---
name: monitoring
description: >
  Monitoring operations skill for read-only health checks, observability design,
  dashboard and alert quality, telemetry gap detection, and incident triage.
  Use when service reliability or incident response confidence is a priority.
---

# Monitoring

Use this skill to build actionable visibility without noisy telemetry. Keep the main context small; load only the reference that matches the task.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. Classify the task, state assumptions and ambiguity, choose the simplest sufficient path, keep changes surgical, and define verification before action. Read-only checks may proceed after classification. Design or behavior changes require brainstorming or an equivalent written design. Privileged monitoring changes require an exact plan, approval, rollback notes, and post-change verification.

## Classify First

- Passive read-only: metrics, logs, traces, dashboards, alerts, inventory, and health summaries.
- Design change: proposed dashboard, instrumentation, SLO, or alert rule changes.
- Privileged change: applying alert, dashboard, exporter, agent, or infra changes.

## Load References

- Grafana, Prometheus, GCP, MIG, Docker, Node Exporter, osquery, or read-only health: `references/read-only-health.md`.
- Dashboard, alert, SLI, SLO, or runbook design: `references/dashboard-alert-design.md`.
- Logs, metrics, traces, OTel, host inventory, or version drift gaps: `references/telemetry-coverage.md`.
- Incident triage, noisy alerts, CI/ops signals, or root-cause separation: `references/incident-triage.md`.
- Quick alert checks: `references/alert-quality-checklist.md`.
- Quick telemetry checks: `references/telemetry-coverage-checklist.md`.

## Rules

- Default to read-only connectors and narrow credentials.
- Tie alerts to user impact and response actions.
- Distinguish symptoms from root-cause signals.
- Minimize cardinality, cost, and alert noise.

## Output Contract

Risks and blind spots first. Include SLI/SLO or signal, threshold, owner, runbook link or next action, and verification.
