# Integration, Contract, And BDD

Use this reference for service integration tests, API tests, consumer-driven contracts, and BDD scenarios.

## Integration Tests

- Verify real boundaries: HTTP handlers, database transactions, queues, providers, auth middleware, and serialization.
- Reuse repo-native test harnesses, containers, fixtures, and environment patterns.
- Assert status codes, response bodies, persisted state, emitted events, retries, and idempotency where relevant.
- Keep data isolated and cleanup explicit.

## Contract Tests

- Use contract tests when a provider and consumer can break independently.
- Capture request/response shape, required headers, auth assumptions, error shapes, versioning, and backward compatibility.
- Mark contract ownership clearly: consumer expectation, provider verification, or shared schema.

## API Integration Frameworks

- Node.js HTTP APIs: Supertest or the repo's existing equivalent.
- Python APIs: pytest with requests/httpx or framework-native clients.
- Java APIs: REST Assured when already in the stack.
- Kubernetes-backed services: prefer existing cluster test tooling and make environment assumptions explicit.

## BDD

Use Cucumber, Robot Framework, or similar tools only when non-engineering stakeholders benefit from readable scenarios. Avoid BDD when plain code tests are clearer and cheaper.

## Output

```markdown
# Integration Test Plan

Boundary:

Tooling:

Contracts:

Scenarios:

Data Setup:

Verification Commands:
```
