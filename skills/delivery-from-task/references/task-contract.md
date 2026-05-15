# Strict Task Contract

Use this reference when a Plane or Notion task link is meant to drive software delivery.

## Required Fields

```yaml
source: plane|notion
task_url: <url or work item key>
repo: <absolute path or repository identifier>
mode: plan_only|execute
approval_gates:
  product: required|preapproved|skip
  engineering: required|preapproved|skip
  external_mutation: required
outputs:
  - <artifact, evidence, PR, patch, report, or comment target>
```

Field rules:

- `source`: task system that owns the linked work. Accept only `plane` or `notion` unless the user explicitly extends the contract.
- `task_url`: direct URL or stable work item key. A pasted title is not enough.
- `repo`: absolute local path is preferred. A repository name is acceptable only if it is unambiguous in the current workspace.
- `mode`: `plan_only` produces a brief and route. `execute` allows implementation after gates pass.
- `approval_gates.product`: use `required` for ambiguous product scope, `preapproved` when the user already approved a PRD/acceptance criteria, `skip` only for trivial maintenance.
- `approval_gates.engineering`: use `required` for broad implementation shape, `preapproved` when an implementation plan already exists, `skip` only for tiny scoped edits.
- `approval_gates.external_mutation`: keep `required`; task-system comments, PR creation, deploys, and production changes need explicit approval unless the current user instruction already grants it.
- `outputs`: concrete deliverables the user expects.

## Optional Fields

```yaml
workspace:
project:
branch:
environment:
task_summary:
acceptance_criteria:
constraints:
credentials_available: yes|no|unknown
allowed_mutations:
  - local_files
  - tests
  - plane_comment
  - notion_comment
  - pull_request
```

Use optional fields to avoid expensive rediscovery. Do not require them when the task link and repo can provide the same evidence.

## Missing Contract Prompt

If a link arrives without enough execution context, ask for this:

```text
Please provide the strict task contract:

source: plane|notion
task_url: <url or work item key>
repo: <absolute path or repository identifier>
mode: plan_only|execute
approval_gates:
  product: required|preapproved|skip
  engineering: required|preapproved|skip
  external_mutation: required
outputs:
  - <artifact, evidence, PR, patch, report, or comment target>
```

If only one required field is missing, ask for that one field directly.

## Validation

Before implementation:

1. Confirm the source task can be read or that the user pasted enough task content.
2. Confirm the repo exists or is uniquely identifiable.
3. Confirm `mode` is explicit.
4. Confirm approval gates do not conflict with the requested action.
5. Confirm outputs are concrete enough to verify.

Stop and ask when any required field remains missing after safe discovery.
