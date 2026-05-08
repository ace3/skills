# DevOps, Security, Monitoring, and Deployment Skills for Claude/Codex/Agents

## Overview

This report surveys high‑value skills for Claude, Codex, and other AI agents that support software engineering tasks in three areas: security scanning, infrastructure monitoring, and deployment/DevOps, with emphasis on Go backends, Docker, GCP, and Linux automation.
It combines marketplace listings (ClaudeMarketplaces) with curated "awesome" collections of Claude/Codex/agent skills and vendor blogs to identify skills that are actively used and well maintained.[^1][^2][^3][^4][^5]

## Skill ecosystems and catalogs

### ClaudeMarketplaces.com

ClaudeMarketplaces is a large directory of Claude Code extensions, including skills, MCP servers, and plugins, organized by categories such as "Security" and "DevOps & CI/CD".[^1]
The site explains that skills are reusable instruction sets that teach agents specific tasks, while marketplaces bundle many plugins; quality is curated by install counts, GitHub stars, and community votes.[^1]

The **DevOps & CI/CD** category groups skills for deployment, continuous integration, monitoring, and infrastructure management, and notes that these skills help Claude configure pipelines, debug CI failures, and automate infrastructure tasks.[^6]
There are also dedicated categories for **Security**, **Monitoring & Observability**, and cloud/infrastructure, which contain many of the skills referenced below.[^1]

### Awesome Claude / Codex / Agent skills repositories

Composio maintains an **awesome-claude-skills** repository that curates Claude Skills, MCP servers, and automation tools for customizing Claude AI workflows, with tens of thousands of stars.[^2]
They also maintain an **awesome-codex-skills** repository for Codex-style skills, which is referenced in external guides even though the raw README text was not fully accessible during this research.[^7][^3]

Multiple "awesome" lists aggregate agent skills more broadly:

- **VoltAgent/awesome-agent-skills** focuses on real‑world agent skills created and used by actual teams, including Cloudflare, Trail of Bits, Sentry, and Microsoft skills for security, observability, and cloud operations.[^8]
- **heilcheng/awesome-agent-skills** is referenced as another curated list, although its README content was not fully accessible in this session.[^9][^4]
- A separate "Awesome Claude Skills" visual directory mirrors and enriches the text list with usage counts and categories such as "Security & Web Testing" and shows popular security skills like VibeSec, OWASP security skills, Trail of Bits security skills, and systematic-debugging.[^10][^11]

External guides such as an AI LLM skills guide and LinkedIn posts confirm that these "awesome" repos now function as de‑facto app stores for AI coding agents, especially in security and DevOps domains.[^12][^13][^9]

### Vendor and blog curation

Pulumi’s blog post "The Claude Skills I Actually Use for DevOps" identifies several concrete skills that materially improve Claude’s behavior for cloud infrastructure engineering, including monitoring, Kubernetes, CI/CD, GitOps, and security review skills.[^14]
Composio’s "Top Codex skills" article similarly highlights Codex skills like `gh-fix-ci`, `webapp-testing`, `mcp-builder`, and `security-threat-model` that make Codex more useful in real dev workflows such as CI debugging and threat modeling.[^7]

These vendor-curated lists are useful for filtering the large skill catalogs down to a set of skills that practitioners actually rely on in production.

## Security-related skills

### High‑level categories

Security skills for Claude and other agents tend to fall into several categories:

- **Code security and OWASP checks** (e.g., OWASP Top 10, ASVS, input validation).
- **Static analysis and automation** (CodeQL, Semgrep, SARIF pipelines).
- **Threat modeling and security review** (threat models, attack surfaces, cloud misconfigurations).
- **Web testing and pentesting helpers** (Burp Suite, SQLi/XSS testing, fuzzing, privesc playbooks).
- **Platform‑specific security skills** (Convex, AWS, Azure, GCP, smart contracts, etc.).[^14][^10][^12][^7]

The sections below highlight security skills that are particularly relevant for scanning Go backends, REST APIs, containers, infra-as-code and DNS/cloud configs.

### OWASP, secure coding, and web security skills

The "Awesome Claude Skills" security section lists several skills that give agents OWASP‑style secure coding capabilities.[^11][^10]
Key examples include:

- **`owasp-security`** – teaches OWASP Top 10 (2025), ASVS 5.0, and Agentic AI security patterns, including secure code review checklists and language‑specific quirks for 20+ languages.[^10]
- **`VibeSec-Skill`** – helps Claude write secure code and prevent common vulnerabilities.[^11][^10]
- **`defense-in-depth`** – focuses on multi‑layered testing and security best practices across staging and production workflows.[^12][^10]

These skills are useful as general security brains that you can layer on top of your own code and infra, particularly for Go APIs, web services, and auth flows.

### Static analysis and security automation skills

The Trail of Bits team has published a large suite of **security analysis skills** which appear both in the Awesome Claude Skills directory and in a separate AI LLM skills guide.[^10][^12]
Representative skills include:

- **`static-analysis`** – a static analysis toolkit that orchestrates CodeQL, Semgrep, and SARIF workflows for vulnerability detection.[^12]
- **`semgrep-rule-creator`** and **`semgrep-rule-variant-creator`** – help author and port Semgrep rules, enabling repository‑specific automated scanning.[^8][^12]
- **`variant-analysis`**, **`differential-review`**, and **`fix-review`** – explore repositories for recurring patterns, perform security‑focused diff review, and verify security fixes.[^12]

These are especially effective when integrated into CI, where Codex or Claude can call the skills as part of code review or nightly scans of Go microservices and IaC repositories.

### Threat modeling and security review skills

For systematic threat analysis rather than only vulnerability scanning, multiple skills provide structured frameworks:

- **`security-threat-model`** (Codex) – helps Codex produce repository‑specific threat models by identifying trust boundaries, attack paths, and possible failures, which is recommended for auth‑heavy or sensitive systems.[^7]
- **`security-review`** – a Claude skill from the Pulumi DevOps blog that focuses on secrets management, input validation, SQL injection, XSS/CSRF prevention, and dependency auditing; it was observed catching issues like missing bucket encryption and overly permissive bucket policies that vanilla Claude missed.[^14]
- **`ai-prompt-engineering-safety-review`** – a Claude skill that analyzes AI prompts for safety risks, data exposure, and prompt injection, relevant when the system itself exposes an AI-powered API.[^15]

These skills are a good complement to code‑level scanning, especially when designing or reviewing security for public APIs and multi‑service architectures.

### Web and infrastructure penetration testing helpers

For active web and cloud testing, several skills integrate popular tools:

- **`ffuf_claude_skill`** – connects Claude with FFUF (a web fuzzer) and helps analyze fuzzing results for vulnerabilities such as hidden endpoints and parameter issues.[^10]
- **Web testing skills** – including skills for Burp Suite project parsing and web testing flows:[^8][^12]
  - `burpsuite-project-parser` – parses Burp Suite project files and surfaces findings for further analysis.
  - `burp-suite-testing` – drives Burp-based web application testing (referenced in broader skill guides).[^12]
- **Pentesting skills suite** – skills like `ethical-hacking-methodology`, `sql-injection-testing`, `xss-html-injection`, `aws-penetration-testing`, and `linux-privilege-escalation` provide frameworks and checklists for pentest‑style activities.[^12]

These are best used in controlled staging environments or in conjunction with existing pentest workflows, where the agent interprets tool output and helps prioritize fixes.

### Platform‑specific security skills

Some security skills are tightly coupled to specific platforms:

- **Convex security skills** – `convex-security-audit` and `convex-security-check` provide security audit checklists, authorization patterns, and environment variable handling guidance for Convex apps, including structured security audit flows.[^16][^17]
- **Cloud security skills** – the AI LLM skills guide lists skills such as `aws-penetration-testing` and others for cloud security assessment; Azure‑specific security skills also exist in the Microsoft skill family.[^8][^12]
- **Smart contract/Web3 security skills** – `building-secure-contracts`, `entry-point-analyzer`, and various Web3 security skills are available but less relevant for Go+Docker backend stacks.[^12]

For your stack (GCP, Go, Docker), generic security skills (OWASP, Trail of Bits static analysis, threat modeling) are more directly applicable, but cloud‑specific skills become useful if you expand into AWS/Azure or specific PaaS platforms.

## Monitoring and observability skills

### Observability/monitoring instructor skills

Monitoring‑oriented skills focus on teaching the agent how to design and interpret observability setups rather than directly scraping metrics.
A Pulumi DevOps article calls out a **`monitoring-expert`** skill that covers structured logging, metrics, distributed tracing, alerting, and performance testing for production systems, including Prometheus, Grafana, and Datadog.[^14]

This skill shifts baseline behavior from "no monitoring" to "monitoring that needs tuning" by ensuring that whenever infrastructure is provisioned, monitoring (metrics, logs, alerts, SLOs) is considered part of the solution.[^14]

### Grafana dashboard design skills

ClaudeMarketplaces and related directories list a **`grafana-dashboards`** skill (and variants) that specialize in building production Grafana dashboards for system and app metrics.[^18][^19][^20]
This skill encodes dashboard design patterns for infra monitoring, microservices, SLO/SLA overviews, and business KPIs; it outputs panel JSON and layout suggestions compatible with Grafana.[^19][^18]

In practice, this type of skill is used to:

- Design dashboards for node exporters, cAdvisor, and application metrics (latency, error rates, throughput) across Docker, Kubernetes, or bare‑metal hosts.[^21][^18][^19]
- Create health overview boards showing disk usage, RAM, CPU, MIG instance status, and error rates for services.
- Propose alert rules and SLO‑based alerting policies.

### Telemetry + OpenTelemetry skills

Some skills focus on instrumentation and telemetry pipelines:

- A guide to tracking Claude Code usage shows how to connect Claude to Grafana Cloud using **OpenTelemetry**, including a Grafana app plugin called **"Claude Code Stats"** that visualizes agent usage and performance.[^22][^21]
- Microsoft’s skill set includes multiple **Azure Monitor OpenTelemetry exporter** skills (e.g., `azure-monitor-opentelemetry-exporter-java`, `azure-monitor-opentelemetry-py`) that teach agents how to wire services into managed observability backends, which parallels patterns for non‑Azure stacks.[^8]

For a Go + Docker + GCP setup, analogous patterns would be applied using OTel Go SDKs, Prometheus exporters, and Grafana dashboards.

## DevOps & deployment skills

### DevOps generalist skills for Claude

ClaudeMarketplaces’ **DevOps & CI/CD** category and related resources highlight skills that teach agents to behave like senior DevOps engineers, able to design CI/CD, containers, and deployment workflows.[^23][^6]
A key example is the **`devops-engineer`** skill:

- Its marketplace entry describes it as a skill that assists with designing CI/CD pipelines, containerization, infrastructure as code, and deployment automation across Docker, Kubernetes, Terraform, and cloud platforms.[^24]
- It provides templates and operational guidance for build automation, environment orchestration, and incident response, and is aimed at platform teams building self‑service infrastructure.

This is particularly relevant for Go + Docker + GCP stacks, since it can generate Dockerfiles, compose/swarm stacks, Kubernetes manifests, Terraform/Pulumi modules, and CI pipelines for the chosen provider.[^25][^26][^14]

### CI/CD and rollout planning skills

Several skills target CI/CD workflows and rollout procedures:

- Pulumi’s DevOps blog lists a **`github-actions-templates`** skill that teaches Claude to write GitHub Actions for CI/CD, including Docker builds, Kubernetes deployments, security scanning, and matrix builds.[^14]
- A **`devops-rollout-plan`** skill in the ClaudeMarketplaces directory generates production‑ready deployment plans for infra and application changes, including preflight checks, verification checkpoints, rollback protocols, and communication plans.[^27]

These skills are valuable for standardizing deployment processes across microservices and environments, and for writing runbooks or change management docs that integrate with tools like SemaphoreCI, GitHub, or GitLab.[^27][^14]

### GitOps and Kubernetes skills

For Kubernetes‑based deployments, Pulumi’s DevOps article highlights skills such as:

- **`kubernetes-specialist`** – covers production cluster management, security hardening, and cloud‑native architectures.[^14]
- **`gitops-workflow`** – teaches GitOps patterns with ArgoCD and Flux CD for automated Kubernetes deployments.[^14]

Although your current stack emphasizes Docker Swarm and MIGs, these skills are useful if you move toward GKE or other Kubernetes platforms, and even in Swarm contexts they provide reusable patterns for declarative deployments and HA architectures.

### Cost optimization and infrastructure architecture skills

The same DevOps skills list includes skills such as **`cost-optimization`** and `cloud-solution-architect` that help design well-architected and cost‑efficient cloud systems across providers.[^8][^14]
These can help ensure that MIGs, load balancers, and managed services on GCP are sized and configured cost‑effectively while still meeting HA and performance requirements.

## Ansible, server automation, and configuration management

### Ansible playbook generation skills

A specific Claude skill called **`creating-ansible-playbooks`** is designed to generate production‑ready Ansible playbooks and roles.[^28]
It focuses on secure defaults, proper role/vars organization, tagging, error handling, and CI‑friendly patterns like linting and Molecule tests.[^28]

This skill is well suited for:

- Provisioning Linux hosts with Go runtimes, Docker, log exporters, and security hardening.
- Defining zero‑downtime deployment playbooks for services running directly on VMs or as Docker containers.
- Integrating Ansible into CI/CD pipelines or GUI tools such as SemaphoreUI via generated playbooks.

### Broader agent skills for infra and DevOps

The **VoltAgent/awesome-agent-skills** repository lists a wide range of infra and DevOps skills from vendors like Cloudflare and Sentry, including:

- Cloudflare skills for workers best practices, sandboxed execution, and web performance.[^8]
- Sentry skills for code review with error and trace context, and for configuring AI monitoring and OTel pipelines.[^8]
- Azure skills for monitor exporters and querying logs/metrics, which illustrate patterns for structured observability and incident management.[^8]

Although some of these skills are platform‑specific, their patterns generalize to other clouds (e.g., integrating application tracing and error monitoring into deployment pipelines and dashboards).

## Codex-oriented skills relevant to security and DevOps

### Codex skills from Composio

The Composio **awesome-codex-skills** repository is referenced as a curated list of practical Codex skills for automation workflows, and external guides summarize some key skills.[^3][^7][^12]
Composio’s blog post on top Codex skills surfaces several that are directly relevant to security, CI, and operations:

- **`gh-fix-ci`** – examines failing GitHub Actions runs and helps determine what broke and how to fix it.[^7]
- **`webapp-testing`** – drives browser‑level testing flows to catch UI issues earlier.[^7]
- **`mcp-builder`** – assists with building and evaluating MCP servers, relevant when building custom integrations for agents.[^7]
- **`connect`** – links Codex across tools like GitHub, Slack, and Notion to orchestrate multi‑tool workflows.[^7]
- **`security-threat-model`** – as described earlier, generates structured threat models for repositories.[^7]

These Codex skills complement Claude skills in mixed environments where both agents are used.

### Agent skill catalogs as a unified layer

The **AI LLM skills guide** provides a unified table of repositories such as `ComposioHQ/awesome-codex-skills`, `VoltAgent/awesome-claude-skills`, and security‑focused skill collections like `gmh5225/awesome-web3-security` and `gmh5225/awesome-game-security`.[^12]
It also lists a broad "Security & Systems" section, including skills like `security-investigator`, `computer-forensics`, and `Threat Hunting`, which can support security operations and investigation workflows.[^12]

For an engineering organization, this means a single catalog can be used to discover both Claude and Codex skills in overlapping domains such as CI, monitoring, and security.

## Recommended skill stack for security, monitoring, and deployment

Based on cross‑referencing ClaudeMarketplaces, awesome skill repositories, and vendor blogs, the following skill stack is recommended for a Go + Docker + GCP organization that wants security scanning, read‑only monitoring, and deployment assistance.

### Security

- **OWASP and secure coding:** `owasp-security`, `VibeSec-Skill`, and `defense-in-depth` to give agents strong secure coding and review checklists for Go backends and REST APIs.[^11][^10][^12]
- **Static analysis and automation:** Trail of Bits skills (`static-analysis`, `semgrep-rule-creator`, `variant-analysis`, `differential-review`, `fix-review`) to integrate CodeQL/Semgrep security scans into CI pipelines.[^8][^12]
- **Threat modeling and security review:** `security-threat-model` (Codex) and Claude’s `security-review` skill to perform structured threat modeling and detect misconfigurations such as missing bucket encryption and lax IAM policies.[^14][^7]
- **Web testing & pentest helpers:** `ffuf_claude_skill`, `burpsuite-project-parser`, and pentest skills like `sql-injection-testing` and `xss-html-injection` for targeted testing of public‑facing APIs and web surfaces.[^10][^12][^8]

### Monitoring and observability

- **Monitoring design:** `monitoring-expert` to ensure any new infra or service includes logging, metrics, tracing, and alerting as first‑class concerns.[^14]
- **Grafana dashboards:** `grafana-dashboards` to generate infrastructure and SLO dashboards for node exporters, Docker/Swarm metrics, and app latency/error rates, plus alerting rules.[^20][^18][^19]
- **Telemetry wiring:** OTel‑related skills and patterns (e.g., Grafana’s Claude Code Stats plugin, Azure monitor exporter skills) as reference patterns for exporting metrics and traces to Grafana or managed backends.[^22][^21][^8]

### Deployment, DevOps, and infra

- **DevOps generalist:** `devops-engineer` as the primary Claude skill for designing CI/CD pipelines, containerization, infra-as-code, and deployment automation across Docker, Kubernetes, Terraform/Pulumi, and cloud providers (including GCP).[^6][^24][^23]
- **CI/CD and rollout:** `github-actions-templates` for CI workflows and `devops-rollout-plan` for robust, documented deployment plans and rollback procedures.[^27][^14]
- **GitOps and Kubernetes (optional):** `kubernetes-specialist` and `gitops-workflow` if migrating towards GKE or a Kubernetes‑heavy architecture.[^14]
- **Cost and architecture:** `cost-optimization` and cloud‑architecture skills (e.g., `cloud-solution-architect`) for designing cost‑efficient, well‑architected cloud systems.[^8][^14]

### Ansible and server automation

- **Ansible playbooks:** `creating-ansible-playbooks` for generating secure, well‑structured Ansible roles and playbooks to provision Linux servers, deploy Go services, and manage Docker on VMs.[^28]
- **Platform-specific integrations:** Azure, Sentry, and Cloudflare skills from VoltAgent’s list for cases where those platforms are part of the stack, providing error monitoring, OTel exporter setups, and best practices for edge functions.[^8]

## Practical considerations for adoption

When adopting these skills, there are several practical considerations:

- **Curation and overlap:** Many skills overlap in scope; starting with a smaller, vetted subset (e.g., `devops-engineer`, `monitoring-expert`, `owasp-security`, `static-analysis`, `security-review`, `grafana-dashboards`, `creating-ansible-playbooks`) reduces cognitive load while still covering core needs.[^6][^10][^14]
- **CI/CD integration:** Skills that orchestrate tools (CodeQL, Semgrep, OTel exporters, FFUF, Burp) are most effective when wired into CI pipelines and nightly jobs, not just used interactively in an IDE.[^7][^12][^14]
- **Environment constraints:** Some skills are platform‑specific (Convex, Azure, Web3); they should be adopted only if those platforms are part of the environment, otherwise they add noise.[^17][^16][^8]
- **Read‑only monitoring:** To keep monitoring read‑only, skills should be used to design dashboards and queries, while execution of health checks and metrics collection remains in standard tooling (Prometheus, node exporters, cAdvisor, Stackdriver), with agents assisting in interpretation and refinement.[^18][^19][^21]

With careful selection and integration, this combined skill stack can provide AI support for secure coding, structured threat modeling, infra monitoring, and repeatable deployment automation across a modern Go + Docker + GCP infrastructure.

---

## References

1. [Security Skills — Auditing, Vulnerability Scanning, Hardening](https://claudemarketplaces.com/skills/category/security) - Claude Code security skills for code auditing, vulnerability detection, and security hardening. Prot...

2. [Anthropic's Claude Security emerges from closed preview to scan ...](https://www.linkedin.com/posts/devopschat_anthropics-claude-security-emerges-from-activity-7455678629746954240-EG7p) - The Claude model incorporates advanced mechanisms to filter harmful or inappropriate content, making...

3. [GitHub repo for DevOps & SRE Engineers: 700+ questions and ...](https://www.linkedin.com/posts/rohit-ghumare_this-github-repo-is-a-gold-mine-for-devops-activity-7377569180897918976-Qhpr) - This GitHub repo is a gold mine for DevOps & SRE Engineers! + This is 100% open source 700+ DevOps I...

4. [Top 9 Claude Skills for Cybersecurity, Hacking, and Vulnerability ...](https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/) - From YARA rule authoring to OWASP compliance checks, these 9 Claude Skills give security professiona...

5. [Anthropic Adds Automated Security Reviews to Claude Code](https://www.devopschat.co/articles/anthropic-adds-automated-security-reviews-to-claude-code) - Anthropic is enhancing its AI chatbot, Claude, with automated security reviews for code. This new fe...

6. [DevOps & CI/CD Skills — Deployment, Monitoring, Pipelines](https://claudemarketplaces.com/skills/category/devops) - Claude Code skills for DevOps workflows. Automate CI/CD pipelines, configure monitoring, manage depl...

7. [Top 10 Codex Skills You Do Not Want to Miss in 2026](https://composio.dev/content/top-codex-skills) - Discover the top 10 OpenAI Codex skills every developer should master — from prompt design to agent ...

8. [VoltAgent/awesome-agent-skills: A curated collection of ... - GitHub](https://github.com/VoltAgent/awesome-agent-skills) - Awesome Agent Skills. Unlike many bulk-generated skill repositories, this collection focuses on real...

9. [Accelerate AI Agent Development with 70+ Open-Source Skills](https://www.linkedin.com/posts/burhansebin_github-seb1nawesome-ai-agent-skills-a-activity-7427403675012202496-aden) - ... DevOps & Infrastructure - Security Auditing - AI/ML Operations ... awesome-agent-skills takes a ...

10. [🤝 Collaboration & Project...](https://github.com/BehiSecc/awesome-claude-skills/blob/main/README.md) - A curated list of Claude Skills. Contribute to BehiSecc/awesome-claude-skills development by creatin...

11. [Awesome Claude Skills - Visual Directory](https://awesomeclaude.ai/awesome-claude-skills) - Enhanced interface for exploring Claude Skills: document processing, development tools, data analysi...

12. [ai-llm-skills-guide AI Agent Skill - Free Download | LLMBase](https://llmbase.ai/skills/gmh5225/ai-llm-skills-guide/) - ComposioHQ/awesome-codex-skills, Practical Codex skills for automation workflows. VoltAgent/awesome-...

13. [Our official Agent Skills repository on GitHub is here ... - Facebook](https://www.facebook.com/googlecloud/posts/our-official-agent-skills-repository-on-github-is-here-skills-are-a-simple-open-/1292862486324409/) - It's called Awesome Agent Skills and it's the closest thing to an App Store for AI coding agents tha...

14. [The Claude Skills I Actually Use for DevOps | Pulumi Blog](https://www.pulumi.com/blog/top-8-claude-skills-devops-2026/) - Install the Pulumi skills and Claude writes better infrastructure code. Add monitoring and security ...

15. [Ai Prompt Engineering Safety Review | Claude Code Skills](https://claudemarketplaces.com/skills/github/awesome-copilot/ai-prompt-engineering-safety-review) - The ai-prompt-engineering-safety-review skill analyzes AI prompts for safety risks, bias, security v...

16. [Convex Security Audit | Claude Code Skills](https://claudemarketplaces.com/skills/waynesutton/convexskills/convex-security-audit) - Convex Security Audit provides developers building on the Convex platform with comprehensive pattern...

17. [Convex Security Check | Claude Code Skills](https://claudemarketplaces.com/skills/waynesutton/convexskills/convex-security-check) - The convex-security-check skill provides Convex developers with a structured security audit checklis...

18. [grafana-dashboards - Claude Skill - Awesome Skills](https://awesomeskill.ai/skill/agents-grafana-dashboards) - The grafana-dashboards skill enables users to create and manage production-ready Grafana dashboards ...

19. [Grafana Dashboards (Grade A) - Claude Skill - Skills Directory](https://skillsdirectory.com/skills/microck-grafana-dashboards) - Security-tested data-ai skill for Claude AI. Grade A. Create and manage production-ready Grafana das...

20. [Grafana Dashboards Claude Code Skill | Observability AI](https://mcpmarket.com/tools/skills/grafana-dashboard-engineer)

21. [Claude Code + OpenTelemetry + Grafana: A guide to tracking usage ...](https://quesma.com/blog/track-claude-code-usage-and-limits-with-grafana-cloud/) - Learn to monitor Claude Code costs, tokens, and latency in 5 minutes using its native OpenTelemetry ...

22. [Claude Code Stats plugin for Grafana](https://grafana.com/grafana/plugins/timurdigital-claudestats-app/) - Team usage analytics for Claude Code powered by OpenTelemetry. Requirements. Grafana 12.3.0 or later...

23. [Best Claude Code Skills for DevOps and Deployment - Agensi](https://www.agensi.io/learn/best-claude-code-devops-skills) - SKILL.md skills for DevOps automation with Claude Code. Dockerfile generation, GitHub Actions, Terra...

24. [Devops Engineer | Claude Code Skills](https://claudemarketplaces.com/skills/jeffallan/claude-skills/devops-engineer) - The devops-engineer skill assists engineers and platform teams with designing and implementing CI/CD...

25. [claude-skills/skills/devops-engineer/SKILL.md at main - GitHub](https://github.com/Jeffallan/claude-skills/blob/main/skills/devops-engineer/SKILL.md) - Creates Dockerfiles, configures CI/CD pipelines, writes Kubernetes manifests, and generates Terrafor...

26. [devops-engineer.md - awesome-claude-code-subagents - GitHub](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/03-infrastructure/devops-engineer.md) - Pipeline design; Build optimization; Test automation; Quality gates; Artifact management; Deployment...

27. [Devops Rollout Plan | Claude Code Skills](https://claudemarketplaces.com/skills/github/awesome-copilot/devops-rollout-plan) - The DevOps Rollout Plan Generator creates production-ready deployment plans for infrastructure and a...

28. [creating-ansible-playbooks | Skills ... - LobeHub](https://lobehub.com/de/skills/jeremylongshore-claude-code-plugins-plus-skills-ansible-playbook-creator) - This skill empowers Claude to generate Ansible playbooks, streamlining infrastructure automation. It...

