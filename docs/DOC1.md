You’ll probably want a small **stack of Claude Skills**, not a single one, to cover those 3 areas. Here’s a concrete combo that matches what you described (security scanning, periodic monitoring, and deployment ops on GCP/Linux/Docker).

## High-level recommendation

At a high level, I’d start with:

- **Security:** `security-scanner` + Claude Code Security integration (optionally via the GitHub Action reviewer).
- **Monitoring:** `grafana-dashboards` as a “monitoring brain” + your existing Grafana/Prometheus/OTel stack.
- **Deployment/Ops:** `devops-engineer` + `creating-ansible-playbooks` + optionally Pulumi-style infra skills for GCP and IaC.

These are all SKILL.md–style Claude Skills that you install into `.claude/skills/` and then invoke in Claude Code / editor integrations. [awesomeskill](https://awesomeskill.ai/skill/claude-workflow-engine-security-scanner)

***

## Recommended skills per goal

### Summary table

| Goal        | Skill(s) to use | What it’s good at |
|------------|-----------------|-------------------|
| Security   | `security-scanner`, Claude Code Security Reviewer, Trail of Bits skills | SAST, secrets, OWASP Top 10, container & IaC checks, PR security reviews |
| Monitoring | `grafana-dashboards` | Designing & evolving Grafana dashboards, observability patterns, SLO/SLA dashboards |
| Deployment | `devops-engineer`, `creating-ansible-playbooks`, Pulumi/Pulumi Agent skills | CI/CD, Docker/K8s/IaC, Ansible playbooks, cloud deployments (incl. GCP) |

 [github](https://github.com/anthropics/claude-code-security-review)

***

## 1. Security scanning skill(s)

You want something that can reason about backends, DNS/domains, REST APIs, containers, and IaC – not just raw regex scanning.

### `security-scanner` skill (primary)

- The **`security-scanner` Claude skill** is explicitly designed for comprehensive security analysis across code, containers, and IaC. [awesomeskill](https://awesomeskill.ai/skill/claude-workflow-engine-security-scanner)
- It combines **SAST**, **secret detection**, **OWASP Top 10 checks**, **container security**, and **IaC validation** (Terraform, CloudFormation, Kubernetes manifests, Helm, etc.). [awesomeskill](https://awesomeskill.ai/skill/claude-workflow-engine-security-scanner)
- It detects issues like **SQLi, XSS, command injection, path traversal, XXE, SSRF, insecure crypto**, and also hard‑coded secrets (API keys, tokens, DB strings, etc.). [awesomeskill](https://awesomeskill.ai/skill/claude-workflow-engine-security-scanner)

How this maps to your needs:

- **Backends / REST APIs:** it can scan your Go backend repos for vulnerabilities & auth issues (OWASP Top 10 style). [snyk](https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/)
- **Containers / Docker / Swarm:** it validates Dockerfiles and container images for privilege escalation, exposed ports, and bad defaults. [awesomeskill](https://awesomeskill.ai/skill/claude-workflow-engine-security-scanner)
- **Infra / DNS / domains:** for pure DNS/domain config you’d still use external tools, but you can feed their outputs (e.g. nmap, dnsrecon, cloud DNS export) to this skill for interpretation and “what to fix” guidance. [snyk](https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/)

### Claude Code Security + GitHub Action reviewer

If your code lives in GitHub, add:

- **Claude Code Security Reviewer GitHub Action**: a GitHub Action that runs on PRs and uses Claude to do **deep semantic security review**, with PR comments on findings. [github](https://github.com/anthropics/claude-code-security-review)
- It’s **diff‑aware** (only changed files), language‑agnostic, and focused on reducing false positives. [github](https://github.com/anthropics/claude-code-security-review)
- Anthropic’s official **Claude Code Security** product does full‑codebase semantic security analysis with a multi‑stage verification pipeline and severity/confidence ratings; findings go into a dashboard where you approve patches. [anthropic](https://www.anthropic.com/news/claude-code-security)

This gives you:

- **Automated PR security reviews** in CI.  
- A stronger “human‑like” security review on top of static scanners (like Snyk, Trivy, etc.). [devopschat](https://www.devopschat.co/articles/anthropic-adds-automated-security-reviews-to-claude-code)

### Trail of Bits security skills (optional hardening)

Trail of Bits maintains a **Claude Skills Marketplace** with skills focused on security research, vulnerability analysis, and secure coding patterns. [github](https://github.com/trailofbits/skills)
Those can complement `security-scanner` if you want deeper audits or more niche areas (e.g. CodeQL workflows, YARA/YARA-X, etc.). [github](https://github.com/trailofbits/skills)

***

## 2. Monitoring / periodic infra checks

You said: read‑only health checks against infra (disk, RAM, Grafana, software versions, etc.). A Claude Skill won’t itself poll your infra, but it can:

1. **Design the monitoring**, dashboards, and alerting.
2. **Generate scripts/queries** you run via cron/CI/Prometheus exporters.
3. Interpret telemetry (metrics/logs) and suggest improvements.

### `grafana-dashboards` skill (core monitoring brain)

- The **`grafana-dashboards` skill** is built specifically to **design and manage production Grafana dashboards** for system and application metrics. [awesomeskill](https://awesomeskill.ai/skill/agents-grafana-dashboards)
- It focuses on building **real‑time observability dashboards** for infra, microservices, and SLO/SLA views, using Prometheus and other data sources. [skillsdirectory](https://skillsdirectory.com/skills/microck-grafana-dashboards)
- It encodes **dashboard design principles**: RED/USE patterns, SLO dashboards, infra monitoring, and business KPIs. [mcpmarket](https://mcpmarket.com/tools/skills/grafana-dashboard-engineer)

How this maps to your monitoring goals:

- Tell Claude “use `grafana-dashboards` to design a health overview for all MIGs, Swarm services, disks, RAM, and app latency,” and it will output **Grafana JSON panel configs** you can apply. [awesomeskill](https://awesomeskill.ai/skill/agents-grafana-dashboards)
- You then wire that to your existing **Prometheus/OTel exporters** for disk, memory, CPU, Docker, etc., and Grafana becomes the “periodic monitoring” UI/alerting layer. [quesma](https://quesma.com/blog/track-claude-code-usage-and-limits-with-grafana-cloud/)

### Telemetry + Grafana integration for Claude itself (optional)

- Claude Code has **native OpenTelemetry (OTel)** support, so you can send its metrics/logs directly to Grafana Cloud and then build dashboards on top. [quesma](https://quesma.com/blog/track-claude-code-usage-and-limits-with-grafana-cloud/)
- There’s also a **Claude Code Stats Grafana plugin** that uses a Prometheus-compatible datasource to visualize team usage and performance. [grafana](https://grafana.com/grafana/plugins/timurdigital-claudestats-app/)

That’s not directly infra health, but nice if you want to monitor model usage/costs along with infra. [grafana](https://grafana.com/grafana/plugins/timurdigital-claudestats-app/)

***

## 3. Deployment / Ops / GCP / Docker / Ansible

You want knowledge of GCP, generic Linux, Ansible, Semaphore UI, Docker, MIG, HA, Compose, Swarm, etc. For that, you want “DevOps brain” skills that know how to write IaC, CI/CD, and deployment workflows.

### `devops-engineer` skill (main deployment brain)

- The **`devops-engineer` Claude skill** is a senior DevOps engineer persona specialized in CI/CD pipelines, containerization, IaC and deployment automation. [github](https://github.com/Jeffallan/claude-skills/blob/main/skills/devops-engineer/SKILL.md)
- It **creates Dockerfiles**, configures CI/CD (GitHub Actions, GitLab CI, Jenkins), writes **Kubernetes manifests**, and generates **Terraform/Pulumi templates**. [github](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/devops-engineer.md)
- It explicitly covers deployment automation, GitOps, incident runbooks, monitoring, and SRE practices. [github](https://github.com/Jeffallan/claude-skills/blob/main/skills/devops-engineer/SKILL.md)

This maps well to your stack:

- **Golang + Docker + Docker Compose/Swarm:** let it generate multi-stage Dockerfiles, Compose stacks, and suggest production-ready build/deploy patterns for Go services. [github](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/devops-engineer.md)
- **GCP / MIG / HA:** use it with Terraform/Pulumi skills to generate configs for GCE instance groups, load balancers, and autoscaling policies on GCP. [app.daily](https://app.daily.dev/posts/the-claude-skills-i-actually-use-for-devops-kzyfkp2aj)
- **Semaphore / CI pipelines:** have it design pipelines in your preferred CI (Semaphore, GitHub Actions, GitLab CI) including build, test, deploy stages, and gating rules. [agensi](https://www.agensi.io/learn/best-claude-code-devops-skills)

### `creating-ansible-playbooks` skill (Ansible automation)

- The **`creating-ansible-playbooks` skill** is focused on producing **production-ready Ansible playbooks** and roles, with security‑first practices (Vault, least‑privilege, secure file permissions, etc.). [lobehub](https://lobehub.com/de/skills/jeremylongshore-claude-code-plugins-plus-skills-ansible-playbook-creator)
- It supports cross‑platform automation, proper role/vars layout, tags, error handling, and CI-friendly practices (linting, Molecule tests). [lobehub](https://lobehub.com/de/skills/jeremylongshore-claude-code-plugins-plus-skills-ansible-playbook-creator)

Use it for:

- **Generic Linux server ops:** provisioning Go runtimes, Docker, log agents, exporters, system hardening. [lobehub](https://lobehub.com/de/skills/jeremylongshore-claude-code-plugins-plus-skills-ansible-playbook-creator)
- **Deployment tasks:** zero‑downtime deploys on bare‑metal or VM‑based hosts, upgrade flows, and rollback playbooks. [agensi](https://www.agensi.io/learn/best-claude-code-devops-skills)
- **Tying into Semaphore/UI:** have this skill generate the Ansible side; then `devops-engineer` can wire it into your CI/CD YAML. [github](https://github.com/Jeffallan/claude-skills/blob/main/skills/devops-engineer/SKILL.md)

### Pulumi / IaC‑centric DevOps skills (for GCP + multi-cloud)

Pulumi and others have released **DevOps/infra Claude Skills** that package their infrastructure best‑practices into skills usable across Claude Code, Cursor, Copilot, etc. [linkedin](https://www.linkedin.com/posts/pulumi_the-claude-skills-i-actually-use-for-devops-activity-7427758497238347776-7xZ3)

- These skills help Claude write **production‑grade infrastructure code**: correct resource structure, security contexts, monitoring, OIDC, and deployment patterns. [pulumi](https://www.pulumi.com/blog/pulumi-agent-skills/)
- They cover **CI/CD automation, environment diagnostics, infra migrations, and deployment processes**, and are called out as some of the “best skills for DevOps & deployment” in 2026. [app.daily](https://app.daily.dev/posts/the-claude-skills-i-actually-use-for-devops-kzyfkp2aj)

For you, they’re especially useful to:

- Model **GCP infra** (networks, MIGs, NAT, load balancers) as code, with proper security and observability patterns. [pulumi](https://www.pulumi.com/blog/pulumi-agent-skills/)
- Keep infra declarative instead of ad‑hoc scripts, while still having Claude generate and refactor the Pulumi/Terraform modules. [linkedin](https://www.linkedin.com/posts/pulumi_the-claude-skills-i-actually-use-for-devops-activity-7427758497238347776-7xZ3)

***

## 4. How to wire this into your workflow

Given your stack, a pragmatic way to use these skills:

1. **Security (CI + periodic):**  
   - Install `security-scanner` and the Claude Code Security Reviewer GitHub Action.  
   - Run them on PRs and on a nightly main‑branch job to scan your Go backends, Docker images, and IaC (Terraform/Pulumi/K8s manifests). [devops](https://devops.com/anthropic-brings-ai-powered-security-scanning-to-enterprise-teams-with-claude-security/)
   - For DNS/domain/API surface, keep external scanners (e.g. nmap, sslyze, DNS dumps) and feed their outputs to the skill for triage and remediation planning. [snyk](https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/)

2. **Monitoring (read‑only, periodic checks):**  
   - Use `devops-engineer` + Pulumi/infra skills to standardize exporters and metrics (node exporters, cAdvisor, etc.). [app.daily](https://app.daily.dev/posts/the-claude-skills-i-actually-use-for-devops-kzyfkp2aj)
   - Use `grafana-dashboards` to generate the Grafana dashboards and alert rules for disk, RAM, MIG instance health, Swarm services, etc. [skillsdirectory](https://skillsdirectory.com/skills/microck-grafana-dashboards)
   - Make your periodic checks just be: “run health‑check scripts + check Grafana alerts + review any anomalies with Claude,” keeping all access read‑only at the monitoring layer. [awesomeskill](https://awesomeskill.ai/skill/agents-grafana-dashboards)

3. **Deployment/Ops (GCP + Linux + Ansible + Docker):**  
   - Use `devops-engineer` to design your CI/CD pipelines, containerization, and deployment strategies for Go services running on Docker/MIGs. [github](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/devops-engineer.md)
   - Use `creating-ansible-playbooks` for server provisioning and app deploy playbooks where you’re not fully on container orchestration. [lobehub](https://lobehub.com/de/skills/jeremylongshore-claude-code-plugins-plus-skills-ansible-playbook-creator)
   - Add Pulumi/Terraform skills if you want the whole thing as IaC (GCP networks, MIG, DNS, certificates, etc.). [linkedin](https://www.linkedin.com/posts/pulumi_the-claude-skills-i-actually-use-for-devops-activity-7427758497238347776-7xZ3)

If you want, in a follow-up I can sketch a minimal repo layout (with `.claude/skills/`, CI workflows, and example prompts) tailored to your exact Go + Docker + GCP + Ansible + Semaphore setup so you can plug these skills in with as little friction as possible.