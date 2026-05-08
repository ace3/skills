# Plane API Reference

Load this when a task needs Plane REST endpoint details, request bodies, pagination, or auth behavior.

## Basics

- Cloud base URL: `https://api.plane.so`.
- Self-hosted base URL: use the instance domain, usually supplied as `PLANE_API_BASE`.
- API-key auth header: `X-API-Key: <token>`.
- OAuth auth header: `Authorization: Bearer <token>`.
- Content type for JSON bodies: `Content-Type: application/json`.
- Rate limit: 60 requests per minute per API key. Watch `X-RateLimit-Remaining` and `X-RateLimit-Reset`.
- Pagination is cursor-based. Use `per_page` up to 100 and follow `next_cursor` while `next_page_results` is true.
- Use `fields=a,b,c` to reduce payloads and `expand=assignees,state,labels` when nested details are needed.

## Deprecation

Plane is deprecating `/api/v1/.../issues/` endpoints in favor of `/api/v1/.../work-items/`. Use `work-items` for new work.

## Common Endpoints

| Task | Method and path |
|---|---|
| List projects | `GET /api/v1/workspaces/{workspace_slug}/projects/` |
| Get project | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/` |
| List work items | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/` |
| Get work item by UUID | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{resource_id}/` |
| Get work item by key | `GET /api/v1/workspaces/{workspace_slug}/work-items/{project_identifier}-{issue_identifier}/` |
| Search work items | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/search/` |
| Advanced search | `POST /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/search/` |
| Create work item | `POST /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/` |
| Update work item | `PATCH /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{resource_id}/` |
| Delete work item | `DELETE /api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{resource_id}/` |
| List states | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/states/` |
| List labels | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/labels/` |
| List modules | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/modules/` |
| List module work items | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/modules/{module_id}/work-items/` |
| List cycles | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/cycles/` |
| List cycle work items | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/work-items/` |
| Workspace members | `GET /api/v1/workspaces/{workspace_slug}/members/` |
| Project members | `GET /api/v1/workspaces/{workspace_slug}/projects/{project_id}/members/` |
| Current user | `GET /api/v1/users/me/` |

## Work Item Fields

Common request fields:

- `name` required on create.
- `description_html` for rich descriptions.
- `description_stripped` for plain extracted text when useful.
- `priority`: `urgent`, `high`, `medium`, `low`, or `none`.
- `state`: state UUID.
- `assignees`: array of member UUIDs.
- `labels`: array of label UUIDs.
- `start_date` and `target_date`: date strings.
- `external_source` and `external_id`: external system link fields for idempotent syncs.
- `parent`, `type`, `type_id`, and `estimate_point` when the project uses those features.

## Safe Mutation Pattern

1. Read current state with `GET`.
2. Resolve names to UUIDs for states, labels, assignees, modules, or cycles.
3. Produce the exact JSON body and endpoint.
4. Ask for approval unless the user already approved execution.
5. Execute `POST`, `PATCH`, or `DELETE`.
6. Verify with a follow-up `GET`.
