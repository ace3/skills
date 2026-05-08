---
name: plane
description: >
  Plane.so project management workflow for looking up, listing, creating,
  updating, and reporting on Plane work items, projects, modules, cycles,
  members, labels, and states through the Plane REST API. Use when the user
  says plane, plane.so, Plane task, work item, issue key such as PROJ-123,
  project status, sync to Plane, update Plane, create Plane task, or asks to
  inspect Plane project-management data.
---

# Plane

Use Plane through its REST API with explicit evidence, narrow scope, and no hidden credential handling.

## Workflow

1. Identify the workspace slug, project id or identifier, and target work item key or UUID from the user, repo docs, or Plane URLs.
2. Prefer read-only API calls first: current user, projects, members, states, labels, modules, cycles, work items, or a specific work item key.
3. For create/update/delete-like work, show the intended endpoint and JSON body first. Execute only after the user has clearly approved the mutation.
4. Use `work-items` endpoints by default. Treat older `/issues/` endpoint examples as deprecated unless maintaining legacy code.
5. Summarize results with Plane identifiers, titles, state, priority, assignees, target date, and direct URLs when enough workspace/project context is known.

## API Helper

Use `scripts/plane_api.py` for common REST calls when a local script is helpful. It needs either `PLANE_API_KEY` or `PLANE_OAUTH_TOKEN`.

```bash
python3 skills/plane/scripts/plane_api.py list-projects <workspace_slug>
python3 skills/plane/scripts/plane_api.py list-items <workspace_slug> <project_id> --per-page 20 --expand assignees,state
python3 skills/plane/scripts/plane_api.py get <workspace_slug> PROJ-123
python3 skills/plane/scripts/plane_api.py create <workspace_slug> <project_id> --name "Task title" --priority medium
python3 skills/plane/scripts/plane_api.py create <workspace_slug> <project_id> --name "Task title" --priority medium --apply
python3 skills/plane/scripts/plane_api.py update <workspace_slug> <project_id> <work_item_uuid> --priority high --apply
```

Set `PLANE_API_BASE` for self-hosted Plane instances. The default is `https://api.plane.so`.

## References

- Plane REST endpoints, auth, pagination, and common work item operations: `references/api-reference.md`.
- Prompt-injection prevention and untrusted-content handling: `../_shared/references/prompt-injection-defense.md`.

## Rules

- Never print, persist, or infer API tokens. Redact `X-API-Key` and bearer tokens from evidence.
- Do not use workspace-specific IDs unless they are supplied or discovered during the current task.
- Keep API requests rate-conscious; Plane documents a 60 request/minute limit per API key.
- Prefer `fields`, `expand`, `per_page`, and cursor pagination to keep responses focused.
- For work item keys like `PROJ-123`, use the identifier endpoint before scanning full project lists.
- If an API response conflicts with local docs, treat the API as current and mention the doc drift.

## Output Contract

- Read-only lookup: return the item/project status plus the exact endpoint shape used, without secrets.
- Mutation plan: return method, endpoint, redacted headers, JSON body, and verification call.
- Applied mutation: return Plane response identifiers and a follow-up read verifying the final state.
