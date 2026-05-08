# Claude / Codex Skills — Software Engineering Reference

> Curated across **5 sources**: [skillsmp.com](https://skillsmp.com), [claudemarketplaces.com](https://claudemarketplaces.com), [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), [ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills), [heilcheng/awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills)
>
> Stack context: **Go · Docker · Docker Swarm · GCP MIG · Nginx · Ansible · Semaphore UI · MySQL · HA**

---

## Table of Contents

1. [Quick Install Summary](#1-quick-install-summary)
2. [Security](#2-security)
   - [autoresearch:security](#21-autoresearchsecurity--top-pick)
   - [ffuf_claude_skill](#22-ffuf_claude_skill)
   - [threat-hunting-with-sigma-rules](#23-threat-hunting-with-sigma-rules)
   - [computer-forensics](#24-computer-forensics)
   - [api-security-best-practices](#25-api-security-best-practices)
   - [security-review](#26-security-review)
3. [Monitoring](#3-monitoring)
   - [holmesgpt-skill](#31-holmesgpt-skill--top-pick)
   - [gh-fix-ci](#32-gh-fix-ci)
   - [datadog-automation](#33-datadog-automation)
   - [pagerduty-automation](#34-pagerduty-automation)
4. [Deployment Ops](#4-deployment-ops)
   - [deployment-patterns](#41-deployment-patterns--top-pick)
   - [vps-deploy](#42-vps-deploy)
   - [github-ops](#43-github-ops)
   - [gh-address-comments](#44-gh-address-comments)
   - [sentry-automation](#45-sentry-automation)
5. [Golang Specific](#5-golang-specific)
   - [golang-pro](#51-golang-pro)
   - [golang-patterns](#52-golang-patterns)
   - [golang-performance](#53-golang-performance)
6. [Multi-Domain / Power Suites](#6-multi-domain--power-suites)
   - [autoresearch (full suite)](#61-autoresearch-full-suite)
   - [affaan-m/everything-claude-code](#62-affaan-meverything-claude-code)
7. [Gap: Custom CLAUDE_DEPLOYOPS.md](#7-gap-custom-claude_deployopsmd)
8. [Source Registry Reference](#8-source-registry-reference)

---

## 1. Quick Install Summary

| Domain | Skill | Source | Stars | Install Command |
|---|---|---|---|---|
| Security | `autoresearch` | uditgoenka | ⭐ 3.9k | `npx skills add uditgoenka/autoresearch` |
| Security | `ffuf_claude_skill` | jthack | ⭐ 131 | `git clone github.com/jthack/ffuf_claude_skill` |
| Security | `threat-hunting-with-sigma-rules` | jthack | ⭐ ~50 | `git clone github.com/jthack/threat-hunting-with-sigma-rules-skill` |
| Security | `computer-forensics` | mhattingpete | — | `github.com/mhattingpete/claude-skills-marketplace` |
| Security | `api-security-best-practices` | sickn33 | 3.7k installs | `npx skills add sickn33/antigravity-awesome-skills --skill api-security-best-practices` |
| Security | `security-review` | affaan-m | 3.1k installs | `npx skills add affaan-m/everything-claude-code` |
| Monitoring | `holmesgpt-skill` | julianobarbosa | ⭐ 65 | `npx skills add julianobarbosa/claude-code-skills` |
| Monitoring | `gh-fix-ci` | ComposioHQ | ⭐ 742 (repo) | `github.com/ComposioHQ/awesome-codex-skills/tree/master/gh-fix-ci` |
| Monitoring | `datadog-automation` | ComposioHQ | — | `github.com/ComposioHQ/awesome-claude-skills/tree/master/datadog-automation` |
| Monitoring | `pagerduty-automation` | ComposioHQ | — | `github.com/ComposioHQ/awesome-claude-skills/tree/master/pagerduty-automation` |
| Deployment | `deployment-patterns` | affaan-m | ⭐ 172k (repo) | `npx skills add affaan-m/everything-claude-code` |
| Deployment | `vps-deploy` | avi977 | — | `skillsmp.com/skills/avi977-ace-claude-toolkit-skills-vps-deploy` |
| Deployment | `github-ops` | affaan-m | — | `npx skills add affaan-m/everything-claude-code` |
| Deployment | `gh-address-comments` | ComposioHQ | — | `github.com/ComposioHQ/awesome-codex-skills/tree/master/gh-address-comments` |
| Deployment | `sentry-automation` | ComposioHQ | — | `github.com/ComposioHQ/awesome-claude-skills/tree/master/sentry-automation` |
| Golang | `golang-pro` | Jeffallan | — | `skillsmp.com/skills/jeffallan-claude-skills-skills-golang-pro-skill-md` |
| Golang | `golang-patterns` | affaan-m | ⭐ 172k (repo) | `npx skills add affaan-m/everything-claude-code` |
| Golang | `golang-performance` | samber | ⭐ ~1k | `npx skills add samber/cc-skills-golang` |

**Minimum recommended install (one command each):**

```bash
# 1. Core multi-domain suite — security + deploy + Go
npx skills add affaan-m/everything-claude-code

# 2. Autonomous security auditor
npx skills add uditgoenka/autoresearch

# 3. Read-only infra monitoring AI
npx skills add julianobarbosa/claude-code-skills

# 4. Go performance + quality
npx skills add samber/cc-skills-golang
```

---

## 2. Security

### 2.1 `autoresearch:security` — Top Pick

| | |
|---|---|
| **Author** | uditgoenka |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/uditgoenka-autoresearch-claude-skills-autoresearch-skill-md) |
| **Stars** | ⭐ 3,923 |
| **Forks** | 295 |
| **Updated** | April 2026 |

**What it does:**

Runs a fully autonomous, iterative security audit using the autoresearch loop pattern. It generates a STRIDE threat model, maps all attack surfaces, then loops through each vulnerability vector — logging every finding with file-level code evidence, OWASP category, and severity rating.

**Coverage for your stack:**

- Backend code: auth flows, input validation, SQL injection, secrets exposure
- REST API surface: auth headers, CORS policy, rate limiting, sensitive data in responses
- DNS/SSL: DNSSEC, CAA records, cert expiry, TLS version checks
- Nginx config: misconfigured headers, open directory listing, proxy leaks
- Dependencies: CVE scan via `govulncheck` and `trivy`
- Docker: image scanning, privileged containers, exposed ports

**Four adversarial personas:**

- Security Adversary — external attacker
- Supply Chain — compromised dependencies
- Insider Threat — malicious internal actor
- Infra Attacker — network/cloud-level exploitation

**Output structure:**

```
security/YYMMDD-HHMM-{slug}/
├── overview.md
├── threat-model.md          # Full STRIDE matrix
├── attack-surface-map.md
├── findings.md              # Severity-ranked, with code evidence
├── owasp-coverage.md
├── dependency-audit.md
└── recommendations.md
```

**Usage:**

```bash
# Install
npx skills add uditgoenka/autoresearch

# Basic full audit
/autoresearch:security

# Scoped to your API and Nginx config
/autoresearch:security
Scope: src/api/**, nginx/**, config/**
Focus: authentication, authorization, DNS

# Bounded — 10 iteration sweep
/autoresearch:security
Iterations: 10

# CI/CD gate — fail if any Critical finding
/autoresearch:security --fail-on critical
Iterations: 10

# Delta mode — only audit files changed since last run
/autoresearch:security --diff

# Auto-fix Critical/High findings after audit
/autoresearch:security --fix
Iterations: 15
```

**Notes:**
- Every finding requires `file:line` code evidence — no theoretical fluff
- Composite metric: `(owasp_tested/10)*50 + (stride_tested/6)*30 + min(findings, 20)`
- Can chain with `/autoresearch:predict` for pre-audit multi-persona code analysis

---

### 2.2 `ffuf_claude_skill`

| | |
|---|---|
| **Author** | jthack |
| **Source** | [github.com/jthack/ffuf_claude_skill](https://github.com/jthack/ffuf_claude_skill) |
| **Stars** | ⭐ 131 |
| **Listed in** | awesome-claude-skills, awesome-agent-skills |

**What it does:**

Integrates the [ffuf](https://github.com/ffuf/ffuf) web fuzzer (Fuzz Faster U Fool) directly into Claude Code. Claude intelligently configures and runs ffuf tasks, interprets results, and surfaces meaningful findings — not raw output dumps.

**Coverage for your stack:**

- REST API endpoint discovery: hidden paths, undocumented admin routes
- Subdomain enumeration on your domains (`nobi.id`, etc.)
- Backup file detection (`/admin.bak`, `/config.php.old`)
- Parameter fuzzing on existing endpoints
- Rate-limit and response code analysis

**Prerequisites:**

```bash
# macOS
brew install ffuf

# Linux / GCP VM
go install github.com/ffuf/ffuf/v2@latest
```

**Install:**

```bash
git clone https://github.com/jthack/ffuf_claude_skill
mkdir -p ~/.claude/skills
cp -r ffuf_claude_skill/ffuf-skill ~/.claude/skills/
```

**Usage examples:**

```
"Fuzz the /api/v1 endpoint on backend-api.honestmining.com for hidden paths"
"Enumerate subdomains for nobi.id"
"Find backup files on the /admin path"
"Test for common directories on https://api.v2.nobi.id"
```

**Notes:**
- Safe defaults: includes rate limiting to avoid service disruption
- Only use on systems you own or have explicit written permission to test
- Complements `autoresearch:security` — ffuf does active scanning, autoresearch does static analysis

---

### 2.3 `threat-hunting-with-sigma-rules`

| | |
|---|---|
| **Author** | jthack |
| **Source** | [github.com/jthack/threat-hunting-with-sigma-rules-skill](https://github.com/jthack/threat-hunting-with-sigma-rules-skill) |
| **Listed in** | awesome-claude-skills, awesome-agent-skills |

**What it does:**

Uses [Sigma](https://github.com/SigmaHQ/sigma) detection rules — the open standard for SIEM rule sharing — to hunt for threats in security event logs. Claude reads Sigma rules, applies them to your logs, and maps findings to MITRE ATT&CK.

**Coverage for your stack:**

- GCP audit logs: suspicious API calls, IAM privilege escalation
- Linux syslog/auth.log: brute force, SSH anomalies, sudo abuse
- Docker daemon logs: container escape attempts, unexpected exec
- Nginx access logs: path traversal attempts, scanner signatures
- Application logs: authentication anomalies, rate limit violations

**Install:**

```bash
git clone https://github.com/jthack/threat-hunting-with-sigma-rules-skill
mkdir -p ~/.claude/skills
cp -r threat-hunting-with-sigma-rules-skill/threat-hunting-with-sigma-rules ~/.claude/skills/
```

**Usage:**

```
"Hunt for threats in /var/log/auth.log using Sigma rules"
"Check these GCP audit logs for signs of privilege escalation"
"Analyze Nginx access logs for scanner activity"
```

**Notes:**
- Best used post-incident or as a scheduled weekly sweep
- Can be paired with holmesgpt-skill for live monitoring + historical log analysis
- Sigma rules are community-maintained and updated frequently — pull the latest from `SigmaHQ/sigma`

---

### 2.4 `computer-forensics`

| | |
|---|---|
| **Author** | mhattingpete |
| **Source** | [github.com/mhattingpete/claude-skills-marketplace](https://github.com/mhattingpete/claude-skills-marketplace) |
| **Listed in** | awesome-claude-skills, awesome-agent-skills |

**What it does:**

Digital forensics analysis and investigation for Linux systems. Three sub-skills:

- `computer-forensics` — full investigation workflow: timeline reconstruction, artifact collection, chain of custody
- `file-deletion` — secure file deletion and data sanitization
- `metadata-extraction` — extract and analyze file metadata for forensic purposes

**Coverage for your stack:**

- Post-breach analysis on GCP VMs or Linux servers
- Identifying modified files during a suspected compromise
- Extracting timestamps and owner metadata from suspicious files
- Secure wipe of sensitive data from decommissioned instances

**Install:**

```bash
git clone https://github.com/mhattingpete/claude-skills-marketplace
mkdir -p ~/.claude/skills
cp -r claude-skills-marketplace/computer-forensics-skills/skills/computer-forensics ~/.claude/skills/
cp -r claude-skills-marketplace/computer-forensics-skills/skills/file-deletion ~/.claude/skills/
cp -r claude-skills-marketplace/computer-forensics-skills/skills/metadata-extraction ~/.claude/skills/
```

**Notes:**
- Read-only analysis approach — does not mutate evidence
- Useful complement to threat-hunting-with-sigma-rules for post-incident workflows

---

### 2.5 `api-security-best-practices`

| | |
|---|---|
| **Author** | sickn33 / antigravity-awesome-skills |
| **Source** | [claudemarketplaces.com](https://claudemarketplaces.com/skills/sickn33/antigravity-awesome-skills/api-security-best-practices) |
| **Installs** | 3,700+ |

**What it does:**

A structured reference skill covering OWASP API Security Top 10. Guides Claude to audit and harden REST, GraphQL, and WebSocket APIs across five domains: authentication/authorization, input validation and sanitization, rate limiting and throttling, data protection, and security testing.

**Coverage for your stack:**

- Go HTTP handler security patterns (Fiber, chi, net/http)
- JWT validation, token expiry, refresh flows
- SQL injection prevention in MySQL queries
- CORS policy for `api.v2.nobi.id`, `backend-api.honestmining.com`
- Rate limiting middleware implementation
- Response data minimization (no sensitive field leakage)

**Install:**

```bash
npx skills add sickn33/antigravity-awesome-skills --skill api-security-best-practices
```

**Notes:**
- Lightweight checklist-style — triggers automatically when you're building or reviewing API code
- Complements `autoresearch:security` (which does full audits) as an always-on guard during development

---

### 2.6 `security-review`

| | |
|---|---|
| **Author** | affaan-m / everything-claude-code |
| **Source** | [claudemarketplaces.com](https://claudemarketplaces.com/skills/affaan-m/everything-claude-code/security-review) |
| **Installs** | 3,100+ |

**What it does:**

Checklist-driven security code review skill. Fires automatically when implementing auth, handling user input, managing secrets, creating API endpoints, or touching sensitive data. Provides specific code patterns and verification steps, not abstract advice.

**Key checks:**

- Secrets management: no hardcoded credentials, env var validation at startup
- SQL injection: parameterized queries, ORM misuse detection
- Auth patterns: session management, password hashing (bcrypt/argon2), MFA hooks
- API endpoint hardening: input schema validation, error message sanitization
- Sensitive data: logging redaction, PII handling, encryption at rest

**Install:**

```bash
npx skills add affaan-m/everything-claude-code
# security-review is included in the bundle
```

**Notes:**
- Part of the `affaan-m/everything-claude-code` collection — installing the collection gets you this plus `deployment-patterns`, `github-ops`, and `golang-patterns`
- Triggers passively during development; no explicit invocation needed

---

## 3. Monitoring

### 3.1 `holmesgpt-skill` — Top Pick

| | |
|---|---|
| **Author** | julianobarbosa |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/julianobarbosa-claude-code-skills-skills-holmesgpt-skill-skill-md) |
| **Stars** | ⭐ 65 |
| **Upstream** | [HolmesGPT by Robusta](https://github.com/robusta-dev/holmesgpt) — CNCF Sandbox |

**What it does:**

Connects Claude Code to live observability data via [HolmesGPT](https://holmesgpt.dev/). Operates with **strict read-only access** (`get`, `list`, `watch` only — never creates or deletes anything). Investigates infra problems, finds root causes, and suggests remediations using natural language queries.

**Coverage for your stack:**

- Docker/container health: unhealthy containers, OOM kills, restart loops
- System resources: disk, RAM, CPU via Prometheus metrics
- Grafana: datasource status, dashboard alert state, panel anomalies
- AlertManager / PagerDuty: alert investigation and correlation
- Log analysis: Loki, stdout, application error patterns
- Software versions: running binary versions vs. expected
- GCP VM health: instance status, network reachability

**30+ built-in toolsets include:**

| Toolset | Covers |
|---|---|
| `kubernetes/core` | Pod/deployment/service health |
| `kubernetes/logs` | Container log analysis |
| `prometheus/metrics` | Metric queries and anomalies |
| `grafana` | Dashboard and alert state |
| `alertmanager` | Alert investigation |
| `loki` | Log aggregation queries |
| `datadog` | DataDog metric correlation |

**Install:**

```bash
# Claude Code skill
npx skills add julianobarbosa/claude-code-skills

# HolmesGPT CLI (macOS)
brew tap robusta-dev/homebrew-holmesgpt && brew install holmesgpt
export ANTHROPIC_API_KEY="your-key"

# HolmesGPT CLI (Linux / GCP VM)
pip install holmesgpt
```

**Usage:**

```bash
# Natural language infra queries
holmes ask "what services are consuming the most memory?"
holmes ask "why is disk usage high on prod-v2-core?"
holmes ask "are there any Grafana alerts firing right now?"
holmes ask "what's the current state of all Docker containers?"

# Alert investigation
holmes investigate alertmanager --alertmanager-url http://localhost:9093

# Interactive mode for complex investigations
holmes ask "investigate the high latency on the API" --interactive

# In Claude Code (after skill install)
"Check disk and RAM across all prod servers"
"Why is the nobi.id API showing 500 errors in Grafana?"
"Is there anything unhealthy in the Docker Swarm cluster?"
```

**Kubernetes Helm deployment (if applicable):**

```yaml
# values.yaml
modelList:
  sonnet:
    api_key: "{{ env.ANTHROPIC_API_KEY }}"
    model: anthropic/claude-sonnet-4-20250514
    temperature: 0

toolsets:
  kubernetes/core:
    enabled: true
  prometheus/metrics:
    enabled: true
  grafana:
    enabled: true

createServiceAccount: true  # read-only RBAC by default
```

**Notes:**
- API keys stored in Kubernetes Secrets — never in image
- Data not used for model training (Anthropic API direct)
- Pair with `threat-hunting-with-sigma-rules` for security-aware monitoring

---

### 3.2 `gh-fix-ci`

| | |
|---|---|
| **Author** | ComposioHQ |
| **Source** | [github.com/ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills/tree/master/gh-fix-ci) |
| **Repo Stars** | ⭐ 742 |

**What it does:**

Inspects failing GitHub Actions CI checks, summarizes failures in plain language, and proposes targeted fixes. Monitors your deployment pipeline health and catches broken builds before they block deployments.

**Coverage for your stack:**

- Failed Go build steps: compilation errors, missing dependencies
- Failed linting: `golangci-lint` rule violations
- Failed tests: test output parsing, flaky test detection
- Docker build failures: layer cache misses, base image issues
- Semaphore-triggered GitHub Actions: status correlation

**Install:**

```bash
git clone https://github.com/ComposioHQ/awesome-codex-skills
mkdir -p ~/.claude/skills
cp -r awesome-codex-skills/gh-fix-ci ~/.claude/skills/
```

**Usage:**

```
"Why is the CI failing on the main branch?"
"Fix the failing GitHub Actions workflow for the docker-build job"
"Summarize what's broken in the last 3 CI runs"
```

---

### 3.3 `datadog-automation`

| | |
|---|---|
| **Author** | ComposioHQ |
| **Source** | [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/master/datadog-automation) |
| **Requires** | Datadog account + Composio API key |

**What it does:**

Automates Datadog via Composio: read and create monitors, query dashboards, pull metric data, manage incidents, and configure alert rules — all through Claude Code natural language.

**Coverage for your stack:**

- Query current metric values (CPU, memory, disk, request rate)
- List firing monitors and their status
- Investigate metric anomalies by time window
- Pull dashboard panel data for specific services
- Create or update alert thresholds

**Install:**

```bash
git clone https://github.com/ComposioHQ/awesome-claude-skills
cp -r awesome-claude-skills/datadog-automation ~/.claude/skills/
# Requires: COMPOSIO_API_KEY + Datadog connected in Composio
```

**Notes:**
- Only use if your stack already uses Datadog; otherwise `holmesgpt-skill` with Prometheus/Grafana covers the same ground without extra SaaS dependency
- For read-only monitoring, HolmesGPT is a better fit; this skill also supports write operations (creating monitors)

---

### 3.4 `pagerduty-automation`

| | |
|---|---|
| **Author** | ComposioHQ |
| **Source** | [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/master/pagerduty-automation) |
| **Requires** | PagerDuty account + Composio API key |

**What it does:**

Automates PagerDuty via Composio: manage incidents, services, on-call schedules, escalation policies, and service dependencies through natural language.

**Coverage for your stack:**

- Query current open incidents and their status
- Get on-call schedule for this week
- Acknowledge or resolve incidents from Claude Code
- View escalation paths for a given service
- List recent alert history for a service

**Install:**

```bash
cp -r awesome-claude-skills/pagerduty-automation ~/.claude/skills/
# Requires: COMPOSIO_API_KEY + PagerDuty connected in Composio
```

**Pair with:** `holmesgpt-skill` — HolmesGPT investigates *why* an alert fired; PagerDuty automation manages *who* responds and tracks incident state.

---

## 4. Deployment Ops

### 4.1 `deployment-patterns` — Top Pick

| | |
|---|---|
| **Author** | affaan-m / everything-claude-code |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/affaan-m-everything-claude-code-kiro-skills-deployment-patterns-skill-md) |
| **Repo Stars** | ⭐ 172,181 |
| **Updated** | March 2026 |

**What it does:**

Comprehensive deployment knowledge skill covering strategies, Docker patterns, CI/CD pipelines, health checks, environment configuration, and rollback procedures. Includes **native Go multi-stage Dockerfile** patterns.

**Built-in deployment strategies:**

| Strategy | When to use |
|---|---|
| Rolling | Standard deploys, backward-compatible changes |
| Blue-Green | Zero-tolerance for issues, instant rollback needed |
| Canary | High-traffic services, risky changes, feature flags |

**Go-specific Dockerfile (included in skill):**

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./cmd/server

FROM alpine:3.19 AS runner
RUN apk --no-cache add ca-certificates
RUN adduser -D -u 1001 appuser
USER appuser
COPY --from=builder /server /server
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/health || exit 1
CMD ["/server"]
```

**Coverage for your stack:**

- Docker Compose and Docker Swarm stack management
- GCP MIG rolling update patterns
- GitHub Actions pipeline templates for Go projects
- Health check endpoint implementation (Go examples included)
- Kubernetes readiness/liveness probes (if applicable)
- Environment variable validation at startup (fail-fast pattern)
- Rollback checklist: `docker service update --rollback`, `gcloud compute instance-groups managed rolling-action`

**Production readiness checklist (included):**

- [ ] All tests pass (unit, integration)
- [ ] No hardcoded secrets in code or config
- [ ] Health check endpoint returns meaningful status
- [ ] Docker image builds reproducibly (pinned versions)
- [ ] Resource limits set (CPU, memory)
- [ ] SSL/TLS enabled on all public endpoints
- [ ] Metrics exported (request rate, latency, errors)
- [ ] Alerts configured for error rate > threshold
- [ ] Rollback plan documented and tested
- [ ] Database migration tested against production-sized data

**Install:**

```bash
npx skills add affaan-m/everything-claude-code
```

**Usage:**

```
"Set up a blue-green deployment for our Go API on GCP"
"Write a Dockerfile for the nobi.id backend"
"Create a GitHub Actions workflow that builds, tests, and deploys to prod"
"What's the rollback procedure for the current Docker Swarm deployment?"
"Add a /health endpoint to this Go service"
```

---

### 4.2 `vps-deploy`

| | |
|---|---|
| **Author** | avi977 |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/avi977-ace-claude-toolkit-skills-vps-deploy-skill-md) |

**What it does:**

Deploys any non-main branch to a VPS/cloud VM automatically via GitHub Actions. Handles the full pipeline: SSH setup, key management, GitHub Secrets configuration, workflow file creation, and post-deploy health checks.

**Coverage for your stack:**

- GCP Compute Engine VM SSH deployment
- `prod-v2-core` and similar named server deployments
- Docker Compose service restart post-deploy
- Automatic GitHub Actions workflow generation
- Secure credential handling (all secrets go to GitHub Secrets, never in code)

**Key principles enforced:**

- Never hardcode credentials — all secrets use GitHub Secrets or env files
- SSH keys exclusively — no password authentication
- Health check verification after each deploy

**Install:**

```bash
# Via npx (if registered)
npx skills add avi977/ace-claude-toolkit

# Manual
# Download from: skillsmp.com/skills/avi977-ace-claude-toolkit-skills-vps-deploy-skill-md
mkdir -p ~/.claude/skills/vps-deploy
# Copy SKILL.md from the download
```

**Usage:**

```
"Deploy the feature/new-api branch to prod-v2-core via GitHub Actions"
"Set up SSH deployment from GitHub Actions to our GCP VM"
"Create a deployment workflow that restarts Docker Compose after pushing"
```

---

### 4.3 `github-ops`

| | |
|---|---|
| **Author** | affaan-m / everything-claude-code |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/affaan-m-everything-claude-code-skills-github-ops-skill-md) |
| **Repo Stars** | ⭐ 172,181 |

**What it does:**

GitHub repository operations via the `gh` CLI: issue triage, PR management, CI/CD status, release management, and security monitoring. Goes beyond simple git commands — handles the full operational lifecycle.

**Coverage for your stack:**

- Monitor CI/CD pipeline status across all branches
- Create and tag releases with changelogs
- List security advisories and Dependabot alerts
- Manage deployment branch protection rules
- PR review workflow automation
- Stale issue/PR cleanup

**Install:**

```bash
npx skills add affaan-m/everything-claude-code
# github-ops is included in the bundle
```

**Usage:**

```
"What's the CI status on all open PRs right now?"
"Create a GitHub release for v1.4.2 with the latest changelog"
"List all Dependabot security alerts across our repos"
"Show me all stale PRs older than 2 weeks"
```

---

### 4.4 `gh-address-comments`

| | |
|---|---|
| **Author** | ComposioHQ |
| **Source** | [github.com/ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills/tree/master/gh-address-comments) |

**What it does:**

Addresses open GitHub PR review comments on the current branch using the `gh` CLI. Reads each unresolved review comment, implements the requested change or provides a reasoned explanation, and marks the conversation resolved.

**Coverage for your stack:**

- Resolves code review blockers before Semaphore-triggered deploys
- Handles both inline code changes and discussion responses
- Works with the worktree-per-branch Claude Code workflow you already use

**Install:**

```bash
git clone https://github.com/ComposioHQ/awesome-codex-skills
cp -r awesome-codex-skills/gh-address-comments ~/.claude/skills/
```

**Usage:**

```
"Address all open review comments on the current PR"
"Fix the review feedback on PR #47 before merging"
```

---

### 4.5 `sentry-automation`

| | |
|---|---|
| **Author** | ComposioHQ |
| **Source** | [github.com/ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills/tree/master/sentry-automation) |
| **Requires** | Sentry account + Composio API key |

**What it does:**

Automates Sentry: issues, events, projects, releases, and alert rules via Composio. Closes the deployment loop — after deploying, Claude can immediately check if new errors appeared in Sentry.

**Coverage for your stack:**

- Query new error events since the last deployment
- List unresolved issues affecting the current release
- Create release markers in Sentry to track deployment regressions
- Configure alert thresholds for new issue types
- Correlate error spikes with deployment timestamps

**Install:**

```bash
cp -r awesome-claude-skills/sentry-automation ~/.claude/skills/
# Requires: COMPOSIO_API_KEY + Sentry connected in Composio
```

**Usage:**

```
"Are there any new Sentry errors since the last deployment?"
"List the top 5 unresolved errors in the production environment"
"Create a Sentry release marker for v1.4.2"
"Set up an alert for when error rate exceeds 1% on the API"
```

---

## 5. Golang Specific

### 5.1 `golang-pro`

| | |
|---|---|
| **Author** | Jeffallan |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/jeffallan-claude-skills-skills-golang-pro-skill-md) |

**What it does:**

Production-grade Go development skill enforcing idiomatic patterns, code quality, and performance. Fires automatically when working on Go code.

**Key behaviors enforced:**

- Run `golangci-lint run` and fix all issues before proceeding
- Profile with `pprof`, write benchmarks, eliminate unnecessary allocations
- Table-driven tests with `-race` flag, fuzzing where appropriate, 80%+ coverage
- Confirm race detector passes before committing
- `errCh` channel patterns for goroutine error handling
- Context cancellation propagation throughout call chains

**Install:**

```bash
# Manual install from skillsmp
# Download from: skillsmp.com/skills/jeffallan-claude-skills-skills-golang-pro-skill-md
mkdir -p ~/.claude/skills/golang-pro
# Place SKILL.md in the folder
```

---

### 5.2 `golang-patterns`

| | |
|---|---|
| **Author** | affaan-m / everything-claude-code |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/affaan-m-everything-claude-code-docs-ja-jp-skills-golang-patterns-skill-md) |

**What it does:**

Idiomatic Go patterns, best practices, and conventions for building robust, efficient, and maintainable Go applications. Covers concurrency, error handling, interface design, and Go module management.

**Key areas:**

- Concurrency: goroutine lifecycle, `sync.WaitGroup`, worker pool patterns, `context.WithCancel`
- Error handling: sentinel errors, `errors.As/Is`, custom error types with stack traces
- Interface design: small interfaces, dependency injection via interfaces
- Module management: `go.sum` integrity, private module proxies
- Build tags and conditional compilation for Linux/GCP targets

**Install:**

```bash
npx skills add affaan-m/everything-claude-code
# golang-patterns is included in the bundle
```

---

### 5.3 `golang-performance`

| | |
|---|---|
| **Author** | samber |
| **Source** | [skillsmp.com](https://skillsmp.com/skills/samber-cc-skills-golang-skills-golang-performance-skill-md) |
| **Updated** | 1 week ago (May 2026) |

**What it does:**

Go performance engineering skill — never optimizes without profiling first. Covers the full cycle: `pprof` profiling → bottleneck identification → optimization → benchstat comparison → commit.

**Key patterns covered:**

- `pprof` CPU and memory profiling workflow
- `go test -bench=. -benchmem -count=6` methodology
- `benchstat` for statistical significance comparison
- Slice/map preallocation patterns
- `strings.Builder` for string concatenation
- Connection pool tuning for MySQL
- Worker pool and `sync.Pool` patterns
- Escape analysis diagnostics (`go build -gcflags="-m"`)
- `b.Loop()` for Go 1.24+ benchmarks

**Cross-references sister skills:**

- `golang-benchmark` — benchmarking methodology
- `golang-troubleshooting` — pprof debugging workflow
- `golang-database` — connection pool and batch processing
- `golang-concurrency` — goroutine and lock patterns
- `golang-safety` — defer in loops, slice aliasing

**Install:**

```bash
npx skills add samber/cc-skills-golang
```

---

## 6. Multi-Domain / Power Suites

### 6.1 `autoresearch` (full suite)

Beyond security, the `autoresearch` package covers all three of your domains with autonomous iterative loops:

| Subcommand | Purpose | Domain |
|---|---|---|
| `/autoresearch:security` | STRIDE + OWASP + red-team audit | Security |
| `/autoresearch:ship` | Universal deploy workflow — code, release, deployment | Deployment |
| `/autoresearch:debug` | Autonomous bug-hunting loop | Monitoring / quality |
| `/autoresearch:predict` | Multi-persona swarm code analysis | Security + quality |
| `/autoresearch:fix` | Iterative error repair until zero remain | Quality |
| `/autoresearch:learn` | Codebase documentation engine | Documentation |

**`/autoresearch:ship` for deployment ops:**

```
# Ship a deployment
/autoresearch:ship --type deployment

# Dry-run first
/autoresearch:ship --type deployment --dry-run

# Ship with 10-minute post-deploy monitoring
/autoresearch:ship --monitor 10

# Just check if it's ready to ship
/autoresearch:ship --checklist-only
```

Ship workflow stages: Identify → Inventory → Checklist → Prepare → Dry-run → Ship → Verify → Log

**Install:**

```bash
npx skills add uditgoenka/autoresearch
```

---

### 6.2 `affaan-m/everything-claude-code`

The single largest collection. One install gets you:

| Skill | Domain |
|---|---|
| `deployment-patterns` | Deployment ops |
| `security-review` | Security |
| `github-ops` | Deployment / CI |
| `golang-patterns` | Go development |
| `git-workflow` | Version control |
| `agent-sort` | Skill management |
| `django-verification` | (not relevant to your stack) |

**Install:**

```bash
npx skills add affaan-m/everything-claude-code
```

**GitHub:** [github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code)

---

## 7. Gap: Custom `CLAUDE_DEPLOYOPS.md`

**None of the 5 marketplaces have coverage for:**

- Ansible playbook review and generation
- Semaphore UI job management and triggering
- GCP MIG-specific rolling update patterns
- Docker Swarm stack diff and update workflows
- HA failover procedures for your specific stack

This gap should be filled with a project-level skill file at `.claude/skills/deployops/SKILL.md`.

**Recommended structure:**

```
.claude/skills/deployops/
├── SKILL.md               # Main skill entry point
└── references/
    ├── ansible.md         # Playbook patterns, vault, inventory management
    ├── semaphore.md       # Semaphore UI API, job triggering, webhook flows
    ├── gcp-mig.md         # MIG update commands, health checks, autohealing
    ├── docker-swarm.md    # Stack deploy, service update, secret management
    └── ha-checklist.md    # HA failover runbook, health verification steps
```

**Sample SKILL.md trigger description:**

```yaml
---
name: deployops
description: >
  Use when working with Ansible playbooks, Semaphore UI, GCP Managed Instance Groups,
  Docker Swarm stacks, Docker Compose, or HA failover procedures. Covers the full
  deployment lifecycle for a Go + Docker + GCP + Ansible + Semaphore stack.
  Stack: Go, Docker, Docker Swarm, GCP MIG, Nginx, Ansible, Semaphore UI, MySQL HA.
---
```

> Want this generated? Ask Claude Code to generate the full `CLAUDE_DEPLOYOPS.md` for your stack and it will produce all reference files above with concrete commands for your exact infrastructure.

---

## 8. Source Registry Reference

| Source | Type | Skills Count | Focus |
|---|---|---|---|
| [skillsmp.com](https://skillsmp.com) | Marketplace | 1.25M+ | Broad ecosystem, star-ranked |
| [claudemarketplaces.com](https://claudemarketplaces.com) | Curated directory | 97+ (security), 218+ (DevOps) | Install-count ranked, community voted |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | GitHub collection | 53.9k ⭐ | SaaS automation, 78 app integrations |
| [ComposioHQ/awesome-codex-skills](https://github.com/ComposioHQ/awesome-codex-skills) | GitHub collection | 742 ⭐ | Codex CLI compatible, lean skills |
| [heilcheng/awesome-agent-skills](https://github.com/heilcheng/awesome-agent-skills) | GitHub curated list | 3.5k ⭐ | Multi-platform (Claude, Codex, Copilot, VS Code) |

**Install method reference:**

```bash
# Via npx (skills registered in npm)
npx skills add <author>/<repo>
npx skills add <author>/<repo> --skill <skill-name>

# Via git + manual copy (unregistered skills)
git clone https://github.com/<author>/<repo>
mkdir -p ~/.claude/skills
cp -r <repo>/<skill-folder> ~/.claude/skills/

# Verify installation
ls ~/.claude/skills/
head ~/.claude/skills/<skill-name>/SKILL.md
```

**Skill location conventions:**

| Platform | Global skills | Project skills |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |
| GitHub Copilot / VS Code | — | `.github/skills/` |

---

*Last updated: May 2026*
*Sources crawled: skillsmp.com · claudemarketplaces.com · github.com/ComposioHQ/awesome-claude-skills · github.com/ComposioHQ/awesome-codex-skills · github.com/heilcheng/awesome-agent-skills*
