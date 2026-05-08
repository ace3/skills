---
name: monitoring
description: >
  Monitoring operations for read-only health checks, observability design,
  dashboard and alert quality, telemetry gap analysis, and incident triage.
  Use when reliability, SLI/SLO confidence, alert actionability, or incident
  response evidence is required.
---

# Monitoring

Build actionable visibility without noisy telemetry. Load the base layer, then only task-relevant references.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. It defines assumptions, simplicity, surgical scope, planning gates, destructive-command handling, and verification.

## Classify

- Passive read-only: metrics, logs, traces, dashboards, alerts, inventory, and health summaries.
- Design change: proposed dashboard, instrumentation, SLO, or alert rule changes.
- Privileged change: applying alert, dashboard, exporter, agent, or infra changes.

## References

- Grafana, Prometheus, GCP, MIG, Docker, Node Exporter, osquery, or read-only health: `references/read-only-health.md`.
- Dashboard, alert, SLI, SLO, runbook design, or alert quality checklist: `references/dashboard-alert-design.md`.
- Logs, metrics, traces, OTel, host inventory, version drift, or telemetry checklist: `references/telemetry-coverage.md`.
- Incident triage, noisy alerts, CI/ops signals, or root-cause separation: `references/incident-triage.md`.

## Rules

- Default to read-only connectors and narrow credentials.
- Tie alerts to user impact and response actions.
- Distinguish symptoms from root-cause signals.
- Minimize cardinality, cost, and alert noise.
- Do not execute destructive commands. Print the exact command for the user to run, explain impact and rollback or recovery limits, then wait for the result.

## Output Contract

Risks and blind spots first. Include SLI/SLO or signal, threshold, owner, runbook link or next action, and verification.
