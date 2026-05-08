# Security Destructive Command Gate Design

## Context

The `ace3-skills` security skills separate passive review, active scanning, and privileged changes. They require approval for privileged changes, but must also explicitly forbid the security agent from executing destructive commands itself.

This design adds a narrow guardrail for the security skill entrypoints and shared base operating layer.

## Goal

The security agent must not execute destructive commands. When destructive action is needed, it must ask the user to run the exact command manually, then continue from the user's reported result.

## Scope

In scope:

- `skills/security-sast/SKILL.md`
- `skills/security-sast/references/karpathy-superpowers-base.md`
- `skills/security-dast/SKILL.md`
- `skills/security-dast/references/karpathy-superpowers-base.md`
- Documentation updates only if needed to keep the public usage contract aligned

Out of scope:

- Changes to other skills
- Changes to upstream `soekarno` prompts
- Automated command blocking outside the skill instructions

## Destructive Command Definition

A destructive command is any command that can delete data or resources, wipe local or remote state, force-rewrite history, destroy infrastructure, remove runtime artifacts broadly, drop or truncate database objects, revoke or rotate credentials, or irreversibly mutate production or security posture.

Examples include:

- `rm -rf`
- `git reset --hard`
- `git clean`
- `docker system prune`
- `terraform destroy`
- `kubectl delete`
- SQL `DROP` or `TRUNCATE`
- Cloud resource deletion
- Credential revocation or rotation

The examples are not exhaustive.

## Behavior

The security skill may run read-only checks after classification.

The security skill may identify a destructive command as the smallest safe remediation, but it must not execute it.

When destructive action is needed, the security skill must:

1. Print the exact command the user should run.
2. Explain the impact and any rollback or recovery limits.
3. Ask the user to execute it manually.
4. Wait for the user's result before continuing.

If the user provides command output, the security skill may continue with read-only verification or the next non-destructive step.

## Error Handling

If a command is ambiguous or has both read-only and destructive modes, the security skill must choose the read-only mode by default. If the destructive mode is required, it must follow the manual execution gate.

If a user explicitly asks the agent to execute a destructive command, the security skill must still refuse execution and ask the user to run it manually.

## Testing

Verification should be simple and repo-local:

- Inspect the changed security skill text for the explicit destructive-command gate.
- Run the existing English validation script.
- Confirm no unrelated skill files changed.

## Acceptance Criteria

- `skills/security-sast/SKILL.md` and `skills/security-dast/SKILL.md` clearly state that destructive commands must not be executed by the agent.
- Both security skill base layers reinforce the same rule.
- The instructions explain the manual-user-execution flow.
- The change is limited to the security skill and aligned docs.
- Validation passes.
