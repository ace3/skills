# Semaphore UI

Use for Semaphore UI and Semaphore API work: projects, repositories, key store entries, inventories, variable groups, task templates, tasks, schedules, runners, and task logs.

## Model

Semaphore work is organized in this order:

1. Project: isolation boundary for teams, systems, environments, or applications.
2. Repository: source for playbooks, scripts, Terraform, OpenTofu, or other automation code.
3. Key Store: credentials for repositories, remote hosts, sudo, vaults, tokens, or secret strings.
4. Inventory: target hosts and host settings.
5. Variable Group: JSON variables and secrets attached to templates. Use `{}` when no variables are needed.
6. Task Template: reusable definition for an automation run.
7. Task: one execution of a template.
8. Schedule: recurring execution of a template.
9. Runner: remote execution agent for private or distributed execution.

## API Safety

- Use bearer tokens through environment variables or a secret manager. Never print tokens, passwords, private keys, cookies, vault values, or secret variable values.
- Prefer the instance Swagger or Postman collection for exact fields because API details can vary by Semaphore version.
- Use explicit project ID, template ID, inventory, variable group, credentials, branch, and prompt values. Do not infer these from naming alone.
- Treat task launch, template mutation, schedule mutation, key store changes, runner registration, and token revocation as privileged changes.
- Require exact request path, JSON body, approval gate, rollback or recovery task, and post-run verification before mutation.

Example headers:

```bash
-H 'Authorization: Bearer ${SEMAPHORE_TOKEN}'
-H 'Content-Type: application/json'
-H 'Accept: application/json'
```

Launch task shape:

```bash
curl -XPOST \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer ${SEMAPHORE_TOKEN}' \
  -d '{"template_id":1}' \
  "${SEMAPHORE_URL}/api/project/1/tasks"
```

Use placeholder IDs in examples unless the user provides real IDs. Do not echo token values.

## Operator Workflow

1. Identify goal: install, configure, inspect, launch, troubleshoot, schedule, or automate through the API.
2. Capture deployment facts: URL, version when available, install method, database type, local executor or remote runners, app type, project, repository, inventory, variable group, task template, and expected target.
3. For a template run, confirm template name and ID, app type, branch or version behavior, playbook or script path, inventory, credentials, variable group, prompt fields, runner tag when used, and parallel task setting.
4. Prefer dry run, check mode, plan, or validation when the app supports it.
5. Before launch, show the exact API call or UI path, parameters, rollback or recovery task, approval requirement, and verification checks.
6. After launch, capture task ID, status, raw log when needed, changed hosts or resources, failures, and real post-run verification.

## Template Guidance

- Ansible: confirm playbook path, inventory, SSH credentials, sudo behavior, vault password when used, variable group, tags, and check mode support.
- Terraform or OpenTofu: confirm working directory, backend credentials, plan versus apply flow, variable group, and `TF_VAR_` environment variables.
- Shell or Bash: confirm runner operating system, executable permissions, shell path, environment variables, and secrets.
- PowerShell: confirm Windows host or runner, PowerShell availability, execution policy, and remoting requirements.
- Python: confirm Python version, package installation method, working directory, and script arguments.
- Enable parallel tasks only when concurrent runs are safe for the target system.

## Runners

Use remote runners when tasks must run on a separate host, in a private subnet, in an isolated container, or across distributed execution hosts.

Server-side settings:

```bash
SEMAPHORE_USE_REMOTE_RUNNER=True
SEMAPHORE_RUNNER_REGISTRATION_TOKEN=<registration-token>
```

Common runner flow:

```bash
semaphore runner setup --config /path/to/runner-config.json
semaphore runner register --config /path/to/runner-config.json
semaphore runner start --config /path/to/runner-config.json
```

Use HTTPS between server and runner unless both are on a trusted private network. Treat runner registration and unregister operations as privileged changes.

## Schedules

Schedules run task templates on cron. Confirm timezone before creating or debugging schedules.

Timezone setting:

```bash
SEMAPHORE_SCHEDULE_TIMEZONE=Asia/Jakarta
```

Cron examples:

```text
*/15 * * * *      every 15 minutes
0 2 * * *         daily at 02:00
0 0 * * 0         Sundays at midnight
0 9 1 * *         first day of every month at 09:00
```

Restart Semaphore after service-level schedule configuration changes. When schedules pass parameters, confirm the template prompt fields and scheduled parameter values match.

## Troubleshooting

Use this order:

1. Confirm install method, version, URL, and authentication method.
2. Check server or container logs.
3. Confirm config file path or environment variables used by the process.
4. Confirm database connectivity and migration state.
5. Confirm encryption and cookie settings did not change unexpectedly.
6. Confirm repository authentication, branch, and clone permissions.
7. Confirm task template references the expected repository, inventory, variable group, and key store entries.
8. Confirm inventory host reachability and sudo behavior.
9. Confirm the task runs on the intended local executor or remote runner.
10. Inspect raw task log when formatted output is incomplete.
11. For schedules, confirm timezone and service restart after config changes.
12. For API calls, confirm bearer token, project ID, template ID, content type, request body, and instance Swagger.

## Output

- Readiness or blocked status.
- Exact UI path or API request shape with secret placeholders.
- Approval gate for privileged changes.
- Dry-run, check-mode, plan, or reason unavailable.
- Task ID, status, log evidence, failures, and verification result.
