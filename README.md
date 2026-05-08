# @ace3/skills

Curated skills for security, monitoring, deployment operations, drawing, and design stress testing across Claude and Codex.

This package exposes five installable skills. Each skill is a compact router that loads one-level `references/` only when needed, keeping prompts cheaper while covering security scans, read-only monitoring, controlled deployments, diagram creation, and plan interviews.

Every operational skill carries a standalone Karpathy + Superpowers base layer. It requires assumptions, the simplest sufficient path, surgical changes, verification before action, approval gates for privileged changes, and manual user execution for destructive commands.

## Skills

| Skill | Use when | Loads guidance for |
|---|---|---|
| `security` | You need threat modeling, code/config audit, active surface scan, log threat hunt, enterprise security report, vulnerability report, penetration-test report, fix queue handoff, or release hardening. | STRIDE, OWASP/API review, Semgrep/CodeQL, `govulncheck`, Trivy, Amass, Naabu, httpx, ffuf, ZAP, Nuclei, SSLyze, Sigma, finding normalization, CVSS, reports, remediation roadmaps, security fix queue bundles. |
| `monitoring` | You need read-only health checks, dashboard/alert design, telemetry gap analysis, dependency/runtime vulnerability inventory, or incident triage. | Grafana, Prometheus, GCP/MIG reads, Docker inspect, Node Exporter, osquery, SLI/SLO design, OTel, version drift, dependency inventory, vulnerability alert reports, alert quality. |
| `deployment-ops` | You need release readiness, GCP MIG rollout, Docker service operations, Ansible Runner, Semaphore UI/API execution, rollback, or post-deploy verification. | Artifact gates, GCP MIG updates, Cloud DNS/LB-aware verification, Docker Compose/Swarm, Ansible Runner, Semaphore UI projects/templates/tasks/runners/schedules, rollback checks. |
| `drawing` | You need to create, design, explain, render, or improve diagrams with Mermaid or Excalidraw. | Mermaid diagram selection and syntax, Excalidraw visual argument design, technical diagram evidence, and format-specific validation. |
| `roast` | You say "roast me" or need a one-question-at-a-time plan, spec, PRD, AGENT_SPEC.md, architecture, or design stress test. | Goal clarity, design tree traversal, codebase-first answers, concrete recommendations, optional CONTEXT.md/ADR-aware domain checks. |

## Install

```bash
npx @ace3/skills install security
npx @ace3/skills install monitoring
npx @ace3/skills install deployment-ops
npx @ace3/skills install drawing
npx @ace3/skills install roast
npx @ace3/skills install --all
```

Flags:
- `--global` installs into `~/.claude/skills` and `~/.codex/skills`
- `--project` installs into `./.claude/skills` and `./.codex/skills`

## Plugin Marketplace

Add marketplace:

```text
/plugin marketplace add https://github.com/ace3/skills.git
```

Install plugins:

```text
/plugin install security@ace3-skills
/plugin install monitoring@ace3-skills
/plugin install deployment-ops@ace3-skills
/plugin install drawing@ace3-skills
/plugin install roast@ace3-skills
```

Marketplace catalogs:
- `.claude-plugin/marketplace.json`
- `.codex-plugin/marketplace.json`

## Optimized Usage

Use one skill at a time unless the task clearly crosses domains. Good prompts include four parts:

1. Skill name: `Use security`, `Use monitoring`, `Use deployment-ops`, `Use drawing`, or `roast me`.
2. Scope: repo path, service, environment, URL, host group, time window, or target allowlist.
3. Action class: read-only review, active scan, plan only, or approved execution.
4. Output contract: findings, health status, rollout plan, rollback plan, or verification evidence.

Template:

```text
Use <skill>. Scope: <exact repo/service/env/targets>. Action: <read-only|active scan|plan only|approved execution>. Output: <specific result and evidence format>.
```

Token-saving rules:
- Ask for the smallest useful scope first.
- Prefer read-only review before active scanning or execution.
- Provide existing logs, configs, scanner output, or commands when available.
- Do not paste every reference file; the skill chooses the right reference by task.
- For multi-step work, start with plan/readiness, then ask for execution after the plan is clear.
- For design, workflow, or behavior changes, start with brainstorming or an equivalent written design before implementation.

## Use Cases And Examples

### Security

Threat model a sensitive API:

```text
Use security. Scope: ./backend-user-engine-v2 auth and passthrough routes. Action: read-only review. Output: STRIDE attack paths with file evidence, severity, remediation, and verification.
```

Run a focused static scan review:

```text
Use security. Scope: Go service repo, Dockerfile, compose files, and CI config. Action: read-only review. Output: confirmed findings only, using govulncheck/Trivy/Semgrep evidence where available.
```

Create a fix handoff for downstream agents:

```text
Use security. Scope: Go service repo auth paths, dependency findings, and staging route exposure. Action: read-only review. Output: security-fix-queue/v1 Markdown bundle with embedded JSON. Route code findings to em-thinking then golang-developer; route infra findings to deployment-ops. Put only confirmed or high-confidence actionable findings in fix_queue.
```

Create an enterprise security report:

```text
Use security. Scope: authorized findings for metabase.example.com. Action: report only. Output: enterprise security report with executive summary, finding table, CVSS vectors, redacted evidence, remediation roadmap, and retest plan.
```

Prepare an active scan safely:

```text
Use security. Scope: https://api.staging.example.com only. Action: active scan plan only. Output: allowlist, rate limits, tools to use, risks, and expected finding schema. Do not run scans yet.
```

Triage security logs:

```text
Use security. Scope: GCP audit logs and Nginx access logs from 2026-05-08 01:00-03:00 UTC. Action: read-only review. Output: timeline, suspicious events, matched Sigma-style logic, impact, and next actions.
```

Benchmark and improve the security skill:

```text
Use security. Scope: the installed security skill. Action: self-improvement plan only. Output: research summary, benchmark scorecard, failed expectations, root-cause diagnosis, minimal patch plan, regression risk, and verification checks. Do not edit files yet.
```

The self-improvement loop researches the current skill, runs three benchmark fixtures for passive Go/API review, active scan planning, and finding normalization, then proposes the smallest approval-gated improvement. It optimizes finding quality without lowering active-scan or privileged-change safety gates.

### Monitoring

Check read-only service health:

```text
Use monitoring. Scope: staging payment services, MIG status, Docker service inspect, Grafana alerts, and Prometheus metrics. Action: read-only. Output: health status by layer and concrete blind spots.
```

Design dashboards and alerts:

```text
Use monitoring. Scope: Go APIs on Docker Swarm behind GCP load balancers. Action: design only. Output: dashboard sections, RED/USE panels, SLI/SLO suggestions, alert thresholds, owners, and runbook links.
```

Triage an incident:

```text
Use monitoring. Scope: production API latency spike after deploy SHA abc123. Action: read-only triage. Output: impact, timeline, hypotheses with evidence for and against, and next checks.
```

Check dependency and runtime vulnerability inventory:

```text
Use monitoring. Scope: GitLab repo, package.json, go.mod, Dockerfiles, Compose files, and scoped Docker host versions. Action: read-only. Output: confirmed and potential vulnerability alerts with evidence, owners, next actions, and verification commands. Do not create GitLab issues or monitoring alerts.
```

### Deployment Ops

Check release readiness:

```text
Use deployment-ops. Scope: backend-user-engine image sha256:..., staging environment. Action: plan only. Output: ready/blocked status, preflight checks, rollout sequence, rollback trigger, and verification plan.
```

Plan a GCP MIG rollout:

```text
Use deployment-ops. Scope: dev MIG, instance template update, external LB path https://api.lb.dev.example.com/v1. Action: plan only. Output: MIG health checks, rollout batches, rollback template, and real-path verification.
```

Refresh one Docker service:

```text
Use deployment-ops. Scope: HA VM /opt/app compose stack, service backend-user-engine. Action: approved execution only after showing exact commands. Output: current digest, pull/up command, rollback command, and post-change checks.
```

Run Ansible or Semaphore UI safely:

```text
Use deployment-ops. Scope: Semaphore UI project dki-staging, deploy template backend-api. Action: plan only. Output: project/template IDs, parameters, dry-run/check-mode path, approval gate, rollback task, and verification evidence to collect.
```

### Drawing

Create a Markdown-native diagram:

```text
Use drawing. Scope: README architecture section and service flow. Action: Mermaid diagram. Output: renderable fenced mermaid block.
```

Create a visual explanation:

```text
Use drawing. Scope: auth callback flow and supplied API examples. Action: Excalidraw diagram. Output: .excalidraw artifact with render validation if available.
```

### Roast

Stress-test a design:

```text
Roast me on this AGENT_SPEC.md. Walk down the design tree one question at a time and recommend the simplest viable answer for each decision.
```

Upgrade into docs-aware roasting:

```text
Roast me on this architecture against the codebase docs. If terminology or decisions need to be captured, update CONTEXT.md inline and offer ADRs only for hard-to-reverse trade-offs.
```

## Safety Model

| Action class | Examples | Default | Required controls |
|---|---|---|---|
| Passive read-only | PromQL/Grafana reads, MIG describe, OS inventory reads, Docker inspect, DNS record reads, repo review, dependency inventory, scanner output review. | Allowed | Narrow credentials, audit trail, evidence summary. |
| Active non-mutating | ZAP, Nuclei, SSLyze, Naabu, httpx, ffuf, Amass, OSV/NVD/GitLab vulnerability lookups. | Blocked unless scoped | Explicit allowlist or lookup scope, rate limits, low parallelism, target exclusions, scan window. |
| Privileged change | Docker update, Ansible/Semaphore run, Cloud DNS change, MIG update, rollback execution, package upgrade, image rebuild, GitLab issue or alert creation. | Denied by default | Exact plan or diff, human approval, short-lived credentials, preflight, rollback path, post-change verification. |

## Base Layer

Operational skills include `references/karpathy-superpowers-base.md` so single-skill installs remain self-contained.

- Karpathy defaults: explicit assumptions, simplicity first, surgical changes, and goal-driven verification.
- Superpowers planning: brainstorming or written design before creative or behavior-changing work.
- Execution gate: exact plan, approval, rollback, and verification before privileged actions; destructive commands are printed for the user to run manually.

## Repository Layout

```text
skills/
  security/
    SKILL.md
    references/
      karpathy-superpowers-base.md
      self-improvement-loop.md
  monitoring/
    SKILL.md
    references/
      karpathy-superpowers-base.md
  deployment-ops/
    SKILL.md
    references/
      karpathy-superpowers-base.md
  drawing/
    SKILL.md
    references/
      mermaid.md
      excalidraw.md
  roast/
    SKILL.md
```

Each `SKILL.md` stays short. Detailed procedures live in `references/` and are loaded only when relevant.

## Validate

Run the English-only check:

```bash
node scripts/validate-english.js
```

List available skills:

```bash
node bin/cli.js list
```

Test project install in a scratch directory:

```bash
tmp=$(mktemp -d)
cd "$tmp"
node /path/to/ace3-skills/bin/cli.js install --all --project
find .claude/skills .codex/skills -type f | sort
```
