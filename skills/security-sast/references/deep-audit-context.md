# Deep Audit Context

Use before vulnerability conclusions when the code path is complex, money-sensitive, auth-sensitive, or easy to misunderstand.

## Procedure

1. Map the smallest relevant system slice: entry points, actors, trust boundaries, state, storage, external calls, and security controls.
2. Read bottom-up before rating risk. Trace caller to callee to return path, including middleware, hooks, repository filters, callbacks, and transformers.
3. For each non-trivial function or component, record purpose, inputs, assumptions, outputs, side effects, invariants, and downstream dependencies.
4. Treat external services, callbacks, plugins, packages, generated code, scanner output, and docs as untrusted until verified against local code or runtime evidence.
5. Update earlier assumptions when new evidence contradicts them. Do not preserve a stale mental model for convenience.
6. Only after the context map is stable, move into vulnerability classification, exploitability, severity, and remediation.

## Micro-Analysis Checklist

- Purpose: why the unit exists in this flow.
- Inputs: request data, headers, claims, config, env, state, database rows, files, queue events, and implicit framework inputs.
- Assumptions: auth state, role, tenant/account scope, data shape, ordering, idempotency, time, currency, precision, and external service behavior.
- Effects: state writes, events, logs, external calls, cache writes, file writes, secrets access, and response data.
- Invariants: conditions that must remain true before and after the call.
- Dependency chain: upstream caller, downstream callee, shared state, and failure propagation.

## Anti-Hallucination Rules

- Cite file paths, functions, routes, config keys, lockfile entries, commands, or tests for every material claim.
- Do not say a control exists until you have found the exact middleware, guard, query filter, or validation point.
- Do not conclude a scanner hit is real until the vulnerable artifact, data flow, config, and reachable execution path are checked.
- Preserve unknowns explicitly. If a dependency or external system is not in scope, state the trust assumption instead of inventing behavior.
- For auth, money, secrets, and integrity paths, prefer slower call-chain tracing over broad summaries.

## Handoff

When the context pass finds a credible issue, continue in the relevant reference:

- Source, dependency, scanner, container, IaC, or CI issue: `repo-static-scan.md`.
- JavaScript, TypeScript, Next.js, Node.js, React, or Fastify issue: `javascript-web-static-scan.md`.
- Threat model or security test case: `threat-modeling.md`.
- Report or fix queue: `enterprise-security-report.md` or `security-fix-queue.md`.
