---
name: deployment-ops
description: >
  Deployment operations for release readiness, GCP MIG rollouts, Docker Compose
  and Swarm service operations, Ansible Runner, Semaphore UI/API execution,
  rollback safety, and post-deploy verification. Use when planning, inspecting,
  or executing controlled operational changes.
---

# Deployment Ops

Plan and verify safe, reversible delivery. Load the base layer, then only task-relevant references.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. It defines assumptions, simplicity, surgical scope, planning gates, destructive-command handling, and verification.

## Classify

- Plan only: release readiness, rollout design, dry run, verification, or rollback planning.
- Passive read-only: current status, logs, health, MIG describe, Docker inspect, Semaphore project, template, task, or log reads.
- Privileged change: deploy, rollback, Docker update, Ansible run, Semaphore task launch or schedule update, Cloud DNS change, or MIG update.

## References

- Artifact, dependency, migration, preflight, ownership, go/no-go, or rollout checklist: `references/release-readiness.md`.
- GCP MIG, instance template, Cloud DNS, load balancer, or real-path verification: `references/gcp-mig-rollout.md`.
- Docker Engine, Compose, Swarm, service update, image swap, or rollback: `references/docker-service-ops.md`.
- Ansible Runner, playbook dry run, inventory, role, tag, or approved playbook execution: `references/ansible-semaphore.md`.
- Semaphore UI/API, projects, repositories, key store, inventories, variable groups, task templates, tasks, schedules, runners, or task logs: `references/semaphore-ui.md`.
- Rollback triggers, rollback checklist, and post-rollback checks: `references/rollback-verification.md`.

## Rules

- Deployment execution requires exact plan or diff, approval, preflight checks, rollback path, and post-change verification.
- Prefer canary or phased rollout for high-risk changes.
- Verify real request paths, not only backend health.
- Keep commands environment-specific and auditable.
- Do not execute destructive commands. Print the exact command for the user to run, explain impact and rollback or recovery limits, then wait for the result.

## Output Contract

Readiness status first. Include rollout sequence, rollback sequence, checks, owners, approval gates, and verification evidence.
