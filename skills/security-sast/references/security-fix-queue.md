# Security Fix Queue Bundle

Use when security findings need to be handed off for implementation by `em-thinking`, `golang-developer`, or `deployment-ops`.

## Purpose

The current security-sast or security-dast skill owns evidence, risk framing, exploitability, routing, and verification requirements. It does not perform broad remediation by default. For implementation handoff, produce one Markdown bundle with an embedded strict JSON block that downstream skills can process one finding at a time.

Owner routing:

- Code findings: `security` -> `em-thinking` -> `golang-developer`.
- Infra, runtime, deployment, DNS, image, load balancer, service operation, or rollout findings: `security` -> `deployment-ops`.

Use `em-thinking` as the thinking consumer name.

## Rules

- Use `security-fix-queue/v1` as the handoff version.
- Put only confirmed or high-confidence actionable findings in `fix_queue`.
- Put weak scanner output, stale advisories, unreachable code, and evidence gaps in `unconfirmed_findings`.
- Keep each fix packet focused on one root cause. Split unrelated vulnerabilities.
- Include enough evidence and verification that the owner does not need to reread the full audit.
- Route by the smallest real owner: code to the thinking-plus-Go chain; infra and operations to `deployment-ops`.
- Preserve destructive-command and privileged-change gates. If a fix needs destructive or privileged action, describe the manual gate, approval need, rollback notes, and exact verification, but do not execute it from the current security skill package.
- Keep `implementation_hints` as hints, not permission for unrelated cleanup.

## Markdown Shape

Use this structure:

````text
# Security Fix Queue Bundle

Summary:
<short human-readable summary>

Owner routing:
- code: security-sast -> em-thinking -> golang-developer
- infra: security-dast -> deployment-ops

```json
<strict JSON payload>
```

Notes:
<optional handling notes, redactions, or scope limits>
````

## Required JSON Schema

Top-level fields:

```json
{
  "handoff_version": "security-fix-queue/v1",
  "producer": "<security-sast|security-dast>",
  "routing_policy": {
    "code": ["em-thinking", "golang-developer"],
    "infra": ["deployment-ops"]
  },
  "scope": {},
  "risk_summary": "",
  "global_constraints": [],
  "fix_queue": [],
  "unconfirmed_findings": []
}
```

Each `fix_queue` item:

```json
{
  "id": "SEC-001",
  "owner_track": "code|infra",
  "target_consumer": "em-thinking -> golang-developer|deployment-ops",
  "title": "",
  "severity": "Critical|High|Medium|Low",
  "confidence": "High|Medium",
  "affected_asset": "",
  "evidence": [],
  "exploit_path": "",
  "fix_intent": "",
  "non_goals": [],
  "implementation_hints": [],
  "verification": [],
  "handoff_to_owner": "",
  "done_when": []
}
```

Recommended object shapes:

- `scope`: include `repo`, `service`, `environment`, `authorized_surfaces`, and `excluded_surfaces` when known.
- `evidence`: objects with `type`, `source`, `location`, and `detail`.
- `verification`: exact commands, tests, scanner reruns, config checks, runtime requests, or real-path checks.
- `unconfirmed_findings`: objects with `title`, `source`, `reason_not_actionable`, and `needed_evidence`.

## Consumer Instructions

### `em-thinking`

Use only for `owner_track: "code"` packets before `golang-developer`.

For each packet:

- Reject vague or over-broad fixes.
- Confirm the fix intent is practical and scoped.
- Identify assumptions that materially change the implementation.
- Split the packet if it hides multiple root causes.
- Produce a short implementation-ready brief for `golang-developer`.

Output expected from the thinking step:

```text
Implementation-ready brief:
- Finding ID:
- Smallest safe fix:
- Assumptions accepted:
- Assumptions that need user confirmation:
- Scope boundaries:
- Go implementation brief:
```

### `golang-developer`

Use only after the thinking step for `owner_track: "code"` packets.

For each implementation-ready packet:

- Follow existing Go service conventions before inventing patterns.
- Fix only the packet scope.
- Avoid unrelated cleanup or refactors.
- Add or update focused regression tests that prove the exploit path is closed.
- Run the packet verification commands.
- Return changed files, tests run, residual risk, and retest status.

Output expected from the Go step:

```text
Fix result:
- Finding ID:
- Changed files:
- Tests run:
- Verification result:
- Residual risk:
- Retest status:
```

### `deployment-ops`

Use directly for `owner_track: "infra"` packets.

For each packet:

- Produce an exact plan before any privileged operational change.
- Prefer read-only inspection, dry-run, canary, and reversible rollout paths.
- Include approval gates, rollback steps, and post-change verification.
- Verify the real request path or runtime surface, not only backend health.
- Do not execute destructive commands; ask the user to run them manually when required.

Output expected from the deployment step:

```text
Ops fix result:
- Finding ID:
- Plan or change summary:
- Approval gate:
- Rollback path:
- Verification result:
- Residual risk:
- Retest status:
```

## Examples

### Go Auth Bug

````markdown
# Security Fix Queue Bundle

Summary:
One confirmed authorization bypass affects public order access. The fix should preserve existing controller shape and add a focused regression test.

Owner routing:
- code: security-sast -> em-thinking -> golang-developer
- infra: security-dast -> deployment-ops

```json
{
  "handoff_version": "security-fix-queue/v1",
  "producer": "<security-sast|security-dast>",
  "routing_policy": {
    "code": ["em-thinking", "golang-developer"],
    "infra": ["deployment-ops"]
  },
  "scope": {
    "repo": "./backend-order-engine-v2",
    "service": "order public API",
    "environment": "staging",
    "authorized_surfaces": ["engine/grpc-public", "src/service/order"],
    "excluded_surfaces": ["admin API", "database migration"]
  },
  "risk_summary": "High-risk IDOR lets an authenticated public user request another user's order by ID.",
  "global_constraints": [
    "No unrelated refactor",
    "Do not change admin or insider API behavior",
    "Do not execute destructive commands"
  ],
  "fix_queue": [
    {
      "id": "SEC-001",
      "owner_track": "code",
      "target_consumer": "em-thinking -> golang-developer",
      "title": "Public order lookup does not bind order ownership to the authenticated user",
      "severity": "High",
      "confidence": "High",
      "affected_asset": "public OrderService.Get",
      "evidence": [
        {
          "type": "code",
          "source": "manual review",
          "location": "src/service/order_service_impl.go:88",
          "detail": "Get loads by order ID without applying authenticated user ID or partner scope."
        },
        {
          "type": "test",
          "source": "local regression probe",
          "location": "test/order_public_auth_test.go",
          "detail": "User A can retrieve User B order when the ID is known."
        }
      ],
      "exploit_path": "An authenticated public user guesses or obtains another order ID and calls the public Get endpoint. The service returns the order because ownership is not checked.",
      "fix_intent": "Public order reads must require both order ID and authenticated user ownership scope.",
      "non_goals": ["Do not change admin order lookup", "Do not add new roles", "Do not redesign auth middleware"],
      "implementation_hints": [
        "Use the existing auth principal already passed into public controller params.",
        "Prefer repository filter composition over post-load filtering.",
        "Add a table-driven service or controller test for same-user allowed and different-user denied."
      ],
      "verification": [
        "go test ./src/service -run TestOrderPublicOwnership -v",
        "go test ./engine/grpc-public/... -run TestOrderPublicGetAuthorization -v"
      ],
      "handoff_to_owner": "Thinking step: confirm this is an IDOR fix, not a role redesign. Go step: implement ownership-bound public order lookup using existing auth principal and repository filters.",
      "done_when": [
        "Different-user public lookup is denied",
        "Owner public lookup still succeeds",
        "Admin and insider behavior is unchanged",
        "Verification commands pass"
      ]
    }
  ],
  "unconfirmed_findings": []
}
```
````

### Dependency CVE

````markdown
# Security Fix Queue Bundle

Summary:
One dependency advisory is actionable because the vulnerable package is reachable from token parsing. A second scanner hit is not actionable yet.

Owner routing:
- code: security-sast -> em-thinking -> golang-developer
- infra: security-dast -> deployment-ops

```json
{
  "handoff_version": "security-fix-queue/v1",
  "producer": "<security-sast|security-dast>",
  "routing_policy": {
    "code": ["em-thinking", "golang-developer"],
    "infra": ["deployment-ops"]
  },
  "scope": {
    "repo": "./backend-user-engine-v2",
    "service": "auth middleware",
    "environment": "dev",
    "authorized_surfaces": ["go.mod", "go.sum", "src/middleware/auth"],
    "excluded_surfaces": ["runtime deploy", "credential rotation"]
  },
  "risk_summary": "A reachable JWT parsing dependency has a high-severity advisory. One image advisory is unconfirmed because the package is not present in the runtime layer inspected.",
  "global_constraints": [
    "Prefer the smallest compatible dependency upgrade",
    "Do not rewrite auth middleware",
    "Do not execute destructive commands"
  ],
  "fix_queue": [
    {
      "id": "SEC-002",
      "owner_track": "code",
      "target_consumer": "em-thinking -> golang-developer",
      "title": "Reachable JWT dependency version has a high-severity advisory",
      "severity": "High",
      "confidence": "High",
      "affected_asset": "auth middleware JWT parsing",
      "evidence": [
        {
          "type": "scanner",
          "source": "govulncheck",
          "location": "go.mod",
          "detail": "The vulnerable module is imported by src/middleware/auth/jwt.go."
        }
      ],
      "exploit_path": "An attacker sends a crafted token to the auth middleware path that reaches the vulnerable parser.",
      "fix_intent": "Upgrade the dependency to the first fixed compatible version and keep token validation behavior unchanged.",
      "non_goals": ["Do not change token claims", "Do not change signing keys", "Do not rotate credentials"],
      "implementation_hints": [
        "Update only the vulnerable module and required transitive versions.",
        "Run existing auth middleware tests before and after the upgrade."
      ],
      "verification": [
        "go test ./src/middleware -run TestAuth -v",
        "govulncheck ./..."
      ],
      "handoff_to_owner": "Thinking step: confirm upgrade-only remediation is enough before proposing auth redesign. Go step: perform the minimal dependency upgrade that clears govulncheck and preserves auth behavior.",
      "done_when": [
        "govulncheck no longer reports the reachable advisory",
        "Auth middleware tests pass",
        "No unrelated dependency churn is introduced"
      ]
    }
  ],
  "unconfirmed_findings": [
    {
      "title": "Scanner reported openssl package in base image",
      "source": "Trivy image scan",
      "reason_not_actionable": "Runtime image layer inspected locally does not include the reported package path.",
      "needed_evidence": "Confirm image digest and rerun Trivy against the deployed digest."
    }
  ]
}
```
````

### Infra Exposure

````markdown
# Security Fix Queue Bundle

Summary:
One confirmed load balancer route exposes an internal admin path. This is an infra routing fix, not an application code fix.

Owner routing:
- code: security-sast -> em-thinking -> golang-developer
- infra: security-dast -> deployment-ops

```json
{
  "handoff_version": "security-fix-queue/v1",
  "producer": "<security-sast|security-dast>",
  "routing_policy": {
    "code": ["em-thinking", "golang-developer"],
    "infra": ["deployment-ops"]
  },
  "scope": {
    "repo": "./devops",
    "service": "public load balancer",
    "environment": "staging",
    "authorized_surfaces": ["compose/nginx.conf", "load balancer route config"],
    "excluded_surfaces": ["application authorization code", "production"]
  },
  "risk_summary": "A public route forwards an internal admin path through the staging load balancer.",
  "global_constraints": [
    "Plan before privileged change",
    "Verify real public request path after rollout",
    "Do not execute destructive commands"
  ],
  "fix_queue": [
    {
      "id": "SEC-003",
      "owner_track": "infra",
      "target_consumer": "deployment-ops",
      "title": "Public load balancer exposes internal admin route",
      "severity": "High",
      "confidence": "High",
      "affected_asset": "staging public load balancer route",
      "evidence": [
        {
          "type": "runtime_request",
          "source": "curl",
          "location": "https://api.staging.example.com/admin/health",
          "detail": "Public request returned 200 from an internal admin route."
        },
        {
          "type": "config",
          "source": "manual review",
          "location": "compose/nginx.conf",
          "detail": "The public server block forwards /admin/ to the admin upstream."
        }
      ],
      "exploit_path": "An unauthenticated internet client can reach an internal admin route through the public load balancer path.",
      "fix_intent": "Remove or block the public /admin/ route while preserving intended internal admin access.",
      "non_goals": ["Do not change application auth code", "Do not touch production", "Do not rotate credentials"],
      "implementation_hints": [
        "Prepare a route diff first.",
        "Use the existing deployment-ops rollout and rollback pattern for the target environment.",
        "Verify the public URL returns 404 or 403 and the internal admin path still works where authorized."
      ],
      "verification": [
        "curl -i https://api.staging.example.com/admin/health",
        "curl -i http://admin.staging.internal/health"
      ],
      "handoff_to_owner": "Deployment ops step: prepare exact route diff, approval gate, rollback path, rollout command, and real-path verification for staging only.",
      "done_when": [
        "Public /admin/ route is not reachable",
        "Authorized internal admin health check still works",
        "Rollback path is documented",
        "Real public request path is verified after rollout"
      ]
    }
  ],
  "unconfirmed_findings": []
}
```
````

### Over-Broad Code Remediation

````markdown
# Security Fix Queue Bundle

Summary:
The security finding is valid, but the remediation must stay narrow. The thinking step should reduce the fix from "rewrite authorization" to one missing permission check.

Owner routing:
- code: security-sast -> em-thinking -> golang-developer
- infra: security-dast -> deployment-ops

```json
{
  "handoff_version": "security-fix-queue/v1",
  "producer": "<security-sast|security-dast>",
  "routing_policy": {
    "code": ["em-thinking", "golang-developer"],
    "infra": ["deployment-ops"]
  },
  "scope": {
    "repo": "./backend-user-engine-v2",
    "service": "admin report export",
    "environment": "staging",
    "authorized_surfaces": ["engine/grpc/controller/report_controller.go", "src/service/report"],
    "excluded_surfaces": ["auth middleware rewrite", "role model migration"]
  },
  "risk_summary": "Admin report export misses one permission check. Broad auth redesign would increase risk and is out of scope.",
  "global_constraints": ["Smallest safe fix only", "No role model redesign", "Do not execute destructive commands"],
  "fix_queue": [
    {
      "id": "SEC-004",
      "owner_track": "code",
      "target_consumer": "em-thinking -> golang-developer",
      "title": "Admin report export bypasses existing export permission",
      "severity": "Medium",
      "confidence": "High",
      "affected_asset": "admin report export endpoint",
      "evidence": [
        {
          "type": "code",
          "source": "manual review",
          "location": "engine/grpc/controller/report_controller.go:142",
          "detail": "Export path checks authentication but not the existing report export permission."
        }
      ],
      "exploit_path": "An authenticated admin without export permission calls the export endpoint and receives report data.",
      "fix_intent": "Apply the existing report export permission check to the export endpoint.",
      "non_goals": ["Do not redesign RBAC", "Do not change report query semantics", "Do not add new permissions"],
      "implementation_hints": [
        "Reuse the permission helper already used by the report detail endpoint.",
        "Add a controller test for authenticated admin without export permission."
      ],
      "verification": [
        "go test ./engine/grpc/controller -run TestReportExportPermission -v"
      ],
      "handoff_to_owner": "Thinking step: reject broad RBAC rewrite and confirm existing permission helper is the intended control. Go step: reuse the helper on the export endpoint and add focused controller coverage.",
      "done_when": [
        "Admin without export permission is denied",
        "Admin with export permission succeeds",
        "No RBAC schema or middleware redesign is introduced"
      ]
    }
  ],
  "unconfirmed_findings": []
}
```
````
