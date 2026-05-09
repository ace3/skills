# Go Microservice Standards

Use this only when the repo is Go-based or the user asks for Go backend work. Treat these as conditional standards: follow the local repo first, then apply the matching rules when the repo already uses or clearly wants this architecture.

## Boundaries

- Keep business logic in service/domain packages, not HTTP/gRPC entrypoints.
- Keep storage concerns in repositories and external calls in providers or clients.
- Keep DTO, proto, transformer, and transport mapping explicit.
- Do not add a new service, module, queue, cache, or abstraction unless it removes real complexity or matches the approved plan.

## Service Layer

- Put `context.Context` first when local convention does so.
- Separate validation errors, business rule errors, and infrastructure errors so callers can respond correctly.
- Use typed request, response, and error contracts where behavior depends on the error class.
- Use decimal-safe types for money or precision-sensitive values; never introduce float math for financial state.
- State idempotency and duplicate-event behavior for callbacks, queues, workers, scheduled jobs, and provider retries.

## Repository And Transactions

- Prevent query state leakage. If the repo uses fluent builders, confirm execution methods clean accumulated filters.
- Start transactions at the use-case boundary and share the transaction handle across repositories when one invariant spans multiple writes.
- Always define rollback behavior. A deferred rollback that becomes a no-op after commit is acceptable when it is the local pattern.
- Prefer repository-level scoping for tenant, account, owner, or permission filters over post-load filtering.

## Provider And Integration Clients

- Keep provider configuration explicit: base URL/host, credentials, TLS posture, timeout, retry policy, and redaction.
- Classify provider failures: retryable, permanent, not found, auth/config, rate limited, malformed response, and ambiguous.
- Validate external response identity, status, amount/count, account/tenant, reference IDs, and schema before trusting it.
- For scoped provider integrations, preserve the local account, tenant, merchant, sub-account, and environment when constructing lookup clients.
- Expose provider status through typed errors, sentinel errors, or structured response types; do not branch on formatted error strings.
- Use one owner for connection lifecycle and cleanup. Avoid ad hoc clients scattered across business logic.

## Tests

- Use table-driven tests when that is the repo convention.
- Prefer manual mocks or existing local mock style over introducing a generator.
- Cover success, validation failure, business-rule failure, infrastructure failure, timeout/cancellation, duplicate events, and retry exhaustion when relevant.
- For T0/T1 paths, test the invariant and at least one negative control.
