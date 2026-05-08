#!/usr/bin/env python3
"""Small Plane REST helper for common read and gated write operations."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request


DEFAULT_BASE_URL = "https://api.plane.so"


def auth_headers() -> dict[str, str]:
    api_key = os.environ.get("PLANE_API_KEY")
    oauth_token = os.environ.get("PLANE_OAUTH_TOKEN")
    if api_key:
        return {"X-API-Key": api_key}
    if oauth_token:
        return {"Authorization": f"Bearer {oauth_token}"}
    raise SystemExit("Set PLANE_API_KEY or PLANE_OAUTH_TOKEN")


def build_url(base_url: str, path: str, query: dict[str, str | int | None] | None = None) -> str:
    base = base_url.rstrip("/")
    url = f"{base}{path}"
    params = {k: str(v) for k, v in (query or {}).items() if v not in (None, "")}
    if params:
        url = f"{url}?{urllib.parse.urlencode(params)}"
    return url


def request_json(method: str, url: str, body: dict[str, object] | None = None) -> object:
    headers = {
        **auth_headers(),
        "Accept": "application/json",
        "User-Agent": "ace3-plane-skill/0.1",
    }
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            if not raw:
                return {"status": response.status}
            return json.loads(raw)
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload: object = json.loads(raw)
        except json.JSONDecodeError:
            payload = raw
        raise SystemExit(json.dumps({"status": exc.code, "error": payload}, indent=2))


def print_json(value: object) -> None:
    print(json.dumps(value, indent=2, sort_keys=True))


def body_from_args(args: argparse.Namespace, include_name: bool) -> dict[str, object]:
    body: dict[str, object] = {}
    if include_name and args.name:
        body["name"] = args.name
    for key in (
        "description_html",
        "description_stripped",
        "priority",
        "state",
        "start_date",
        "target_date",
        "external_source",
        "external_id",
        "parent",
        "type",
        "type_id",
        "estimate_point",
    ):
        value = getattr(args, key, None)
        if value not in (None, ""):
            body[key] = value
    if getattr(args, "assignee", None):
        body["assignees"] = args.assignee
    if getattr(args, "label", None):
        body["labels"] = args.label
    return body


def maybe_apply(args: argparse.Namespace, method: str, url: str, body: dict[str, object]) -> None:
    if not args.apply:
        print_json({"dry_run": True, "method": method, "url": url, "body": body})
        return
    print_json(request_json(method, url, body))


def add_common_filters(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--per-page", type=int, default=20)
    parser.add_argument("--cursor")
    parser.add_argument("--fields")
    parser.add_argument("--expand")
    parser.add_argument("--order-by")
    parser.add_argument("--external-source")
    parser.add_argument("--external-id")


def add_body_args(parser: argparse.ArgumentParser, *, require_name: bool) -> None:
    parser.add_argument("--name", required=require_name)
    parser.add_argument("--description-html")
    parser.add_argument("--description-stripped")
    parser.add_argument("--priority", choices=["urgent", "high", "medium", "low", "none"])
    parser.add_argument("--state")
    parser.add_argument("--start-date")
    parser.add_argument("--target-date")
    parser.add_argument("--external-source")
    parser.add_argument("--external-id")
    parser.add_argument("--parent")
    parser.add_argument("--type")
    parser.add_argument("--type-id")
    parser.add_argument("--estimate-point")
    parser.add_argument("--assignee", action="append", default=[])
    parser.add_argument("--label", action="append", default=[])


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Plane REST API helper")
    parser.add_argument("--base-url", default=os.environ.get("PLANE_API_BASE", DEFAULT_BASE_URL))
    sub = parser.add_subparsers(dest="command", required=True)

    list_projects = sub.add_parser("list-projects")
    list_projects.add_argument("workspace_slug")

    list_items = sub.add_parser("list-items")
    list_items.add_argument("workspace_slug")
    list_items.add_argument("project_id")
    add_common_filters(list_items)

    get_item = sub.add_parser("get")
    get_item.add_argument("workspace_slug")
    get_item.add_argument("identifier", help="Work item key such as PROJ-123")

    create = sub.add_parser("create")
    create.add_argument("workspace_slug")
    create.add_argument("project_id")
    add_body_args(create, require_name=True)
    create.add_argument("--apply", action="store_true")

    update = sub.add_parser("update")
    update.add_argument("workspace_slug")
    update.add_argument("project_id")
    update.add_argument("resource_id", help="Work item UUID")
    add_body_args(update, require_name=False)
    update.add_argument("--apply", action="store_true")

    args = parser.parse_args(argv)
    base = args.base_url

    if args.command == "list-projects":
        url = build_url(base, f"/api/v1/workspaces/{args.workspace_slug}/projects/")
        print_json(request_json("GET", url))
    elif args.command == "list-items":
        url = build_url(
            base,
            f"/api/v1/workspaces/{args.workspace_slug}/projects/{args.project_id}/work-items/",
            {
                "per_page": args.per_page,
                "cursor": args.cursor,
                "fields": args.fields,
                "expand": args.expand,
                "order_by": args.order_by,
                "external_source": args.external_source,
                "external_id": args.external_id,
            },
        )
        print_json(request_json("GET", url))
    elif args.command == "get":
        url = build_url(base, f"/api/v1/workspaces/{args.workspace_slug}/work-items/{args.identifier}/")
        print_json(request_json("GET", url))
    elif args.command == "create":
        url = build_url(base, f"/api/v1/workspaces/{args.workspace_slug}/projects/{args.project_id}/work-items/")
        maybe_apply(args, "POST", url, body_from_args(args, include_name=True))
    elif args.command == "update":
        url = build_url(
            base,
            f"/api/v1/workspaces/{args.workspace_slug}/projects/{args.project_id}/work-items/{args.resource_id}/",
        )
        maybe_apply(args, "PATCH", url, body_from_args(args, include_name=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
