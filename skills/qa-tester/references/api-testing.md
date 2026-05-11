# API Testing

Use this reference for backend API execution checks, Bruno/Postman collections, raw HTTP probing, REST Assured, Supertest, GraphQL, and WebSocket validation.

## Procedure

1. Confirm base URL, environment, auth method, test account, and mutation safety.
2. Inspect existing API collections, request examples, OpenAPI specs, route tests, or README commands.
3. Cover status codes, response shape, auth, permissions, validation errors, pagination, idempotency, and backward compatibility.
4. Capture request method, path, sanitized headers, payload, response status, response body summary, and timing.
5. For mutation checks, use disposable test data and name cleanup requirements.

## Tool Guidance

- Bruno: prefer when collections are already in repo and versioned with code.
- Postman/Newman: use when the project already owns collections or CI scripts.
- Supertest: useful for local Node HTTP integration checks.
- REST Assured: useful for Java API checks when already present.
- Raw HTTP: acceptable for focused verification when no collection exists.

## Output

```markdown
# API QA

Target:

Auth:

Requests:

Assertions:

Defects:

Blocked:
```
