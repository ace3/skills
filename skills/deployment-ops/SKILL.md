---
name: deployment-ops
description: >
  Deployment operations skill for release readiness, GCP MIG rollouts,
  Docker Compose and Swarm service operations, Ansible Runner, Semaphore UI/API
  execution, rollback safety, and post-deploy verification. Use when planning
  or executing production changes that require controlled risk.
---

# Deployment Ops

Use this skill for safe, reversible delivery. Keep the main context small; load only the reference that matches the task.

## Base Operating Layer

Load `references/karpathy-superpowers-base.md` first. Classify the task, state assumptions and ambiguity, choose the simplest sufficient path, keep changes surgical, and define verification before action. Read-only checks may proceed after classification. Design or behavior changes require brainstorming or an equivalent written design. Privileged deployment changes require an exact plan, approval, rollback notes, and post-change verification.

## Classify First

- Plan only: release readiness, rollout design, dry run, verification, or rollback planning.
- Passive read-only: current status, logs, health, MIG describe, Docker inspect, Semaphore project, template, task, or log reads.
- Privileged change: deploy, rollback, Docker update, Ansible run, Semaphore task launch or schedule update, Cloud DNS change, or MIG update.

## Load References

- Artifact, dependency, migration, preflight, ownership, or go/no-go gates: `references/release-readiness.md`.
- GCP MIG, instance template, Cloud DNS, load balancer, or real-path verification: `references/gcp-mig-rollout.md`.
- Docker Engine, Compose, Swarm, service update, image swap, or rollback: `references/docker-service-ops.md`.
- Ansible Runner, playbook dry run, inventory, role, tag, or approved playbook execution: `references/ansible-semaphore.md`.
- Semaphore UI/API, projects, repositories, key store, inventories, variable groups, task templates, tasks, schedules, runners, or task logs: `references/semaphore-ui.md`.
- Rollback triggers and post-rollback checks: `references/rollback-verification.md`.
- Quick rollout checklist: `references/rollout-checklist.md`.
- Quick rollback checklist: `references/rollback-checklist.md`.

## Rules

- Deployment execution requires exact plan or diff, approval, preflight checks, rollback path, and post-change verification.
- Prefer canary or phased rollout for high-risk changes.
- Verify real request paths, not only backend health.
- Keep commands environment-specific and auditable.

## Output Contract

Readiness status first. Include rollout sequence, rollback sequence, checks, owners, approval gates, and verification evidence.
